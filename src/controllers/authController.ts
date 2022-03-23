import { checkPassword, hashPassword } from './../utils/crypt';

import jwt from "jsonwebtoken";
import UserRepositories from '../db/repositories/UserReponsitories'
class Authentication {

  public getUserByToken = async (req, res) => {

    const userId = req.user;
    const user = await UserRepositories.get(userId);
    return res.status(200).send({ message: "Đăng nhập thành công", user: JSON.stringify(user), status: true });

  };

  public register = async (req, res) => {
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username) {
        return res.status(500).send({ message: "Vui lòng nhập đầy đủ thông tin !" });
      }
      const regex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
      if (!regex.test(email)) {
        return res.status(500).send({ message: "Email không hợp lệ !" });
      }
      const user = await UserRepositories.findByEmail(email);
      if (user) {
        return res.status(500).send({ message: "Email đã tồn tại trong hệ thống" });
      }
      if (password.length < 6) {
        return res.status(500).send({ message: "Mật khẩu phải dài hơn 6 ký tự" });
      }
      if (password.length > 25) {
        return res.status(500).send({ message: "Mật khẩu phải ngắn hơn 25 ký tự" });
      }
      await UserRepositories.create({
        email,
        password: await hashPassword(password),
        username
      });
      return res.status(200).json({ message: "oke" })

    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  public login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(500).send({ message: "Vui lòng nhập đầy đủ thông tin !", status: "false" });
      }
      const userByEmail = await UserRepositories.getPasswordByEmail(email);
      const userByUsername = await UserRepositories.getPasswordByUserName(email);
      if (!userByUsername && !userByEmail) {
        return res.status(500).send({ message: "Tên đăng nhập hoặc mật khẩu không đúng!", status: false });
      }
      const user = userByUsername ? userByUsername : userByEmail
      const checkPasswordInput = await checkPassword(password, user.password);
      if (!checkPasswordInput) {
        return res.status(500).send({ message: "Có cái mật khẩu không nhớ được là sao, buddy?", status: false });
      }

      const jsonWebToken = jwt.sign({ userID: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      const refreshToken = jwt.sign({ userID: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      });
      
      return res.status(200).send({ message: "Đăng nhập thành công", token: jsonWebToken, refreshToken, user: JSON.stringify(user), status: true });

    } catch (err) {
      return res.status(500).send({ message: err.message, status: false });
    }
  };

  public getAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    // verify refreshToken
    if (!refreshToken) {
      return res.status(400).send({
        message: "no enough fields",
      });
    }
    const check = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    // true => create new access token
    if (check.userID) {

      const checkUser = await UserRepositories.get(check.userID);
      if (!checkUser) {
        return res.status(403).send({
          message: "Please Login",
        });
      }
      const jsonWebToken = jwt.sign(
        { userID: check.userID },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).send({
        token: jsonWebToken,
        refreshToken: refreshToken,
        msg: "oke",
      });

    } else {
      return res.status(403).send({
        message: "Token expired, Please try again",
      });
    }

  };

  public forgetPassword = async (req, res) => {
    // try {
    //   const { email } = req.body;
    //   if (!email) {
    //     return res.status(500).send({ message: "Vui lòng nhập email !" });
    //   }
    //   const regex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
    //   if (!regex.test(email)) {
    //     return res.status(500).send({ message: "Email không hợp lệ !" });
    //   }
    //   return redisClient.get(email).then(async (result) => {
    //     if (result) {
    //       return res.status(500).send({ message: "Vui lòng kiểm tra email thay đổi mật khẩu mới !" });
    //     } else {
    //       const user = await UserRepository.findByEmail(email);
    //       if (user) {
    //         const token = await hashPassword(Date.now().toString());
    //         await Promise.all([redisClient.set(email, token, "EX", 3600), redisClient.set(token, email, "EX", 3600)]);
    //         await Mail.sendChangePasswordMail(email, `${user.last_name} ${user.first_name}`, token);
    //         res.status(200).send({ message: "Bạn vui lòng kiểm tra email" });
    //       } else {
    //         return res.status(500).send({ message: "Email không tồn tại !" });
    //       }
    //     }
    //   });
    // } catch (err) {
    //   res.status(500).send({ message: err.message });
    // }
  };

  public resetPassword = async (req, res) => {
    // try {
    //   const { token, newPassword } = req.body;
    //   if (!newPassword || !token) {
    //     return res.status(500).send({ message: "Vui lòng nhập đầy đủ thông tin !" });
    //   }
    //   if (newPassword.length < 6) {
    //     return res.status(500).send({ message: "Mật khẩu mới phải dài hơn 6 ký tự" });
    //   }
    //   if (newPassword.length > 25) {
    //     return res.status(500).send({ message: "Mật khẩu mới phải ngắn hơn 25 ký tự" });
    //   }
    //   return redisClient.get(token).then(async (result) => {
    //     if (result) {
    //       const user = await UserRepository.findByEmail(result);
    //       if (user) {
    //         return UserRepository.update({
    //           user_id: user._id.toString(),
    //           password: await hashPassword(newPassword),
    //         }).then(async (data) => {
    //           await Promise.all([redisClient.del(result), redisClient.del(token)]);
    //           if (data) {
    //             return res.status(200).send({ message: "Đổi mật khẩu thành công" });
    //           } else {
    //             return res.status(500).send({ message: "Đổi mật khẩu thất bại" });
    //           }
    //         });
    //       } else {
    //         return res.status(404).send({ message: "Token không tồn tại !" });
    //       }
    //     } else {
    //       return res.status(404).send({ message: "Token không tồn tại !" });
    //     }
    //   });
    // } catch (err) {
    //   res.status(500).send({ message: err.message });
    // }
  };

  public verifyEmail = async (req, res) => {
    // try {
    //   if (!(await isAuthenticated(req, res))) {
    //     return res.status(500).send({ message: "Bạn chưa đăng nhập !" });
    //   }
    //   const userId = await getUserIdFromRequest(req);
    //   const user = await UserRepository.get(userId);
    //   if (user.email_verify) {
    //     return res.status(500).send({ message: "Bạn đã xác thực email !" });
    //   }
    //   if (user.email === "") {
    //     return res.status(500).send({ message: "Vui lòng cập nhật email" });
    //   }
    //   return redisClient.get(`verify-email-${userId}`).then(async (result) => {
    //     if (result) {
    //       return res.status(500).send({ message: "Vui lòng kiểm tra email xác thực !" });
    //     } else {
    //       const token = await hashPassword(userId + Date.now().toString());
    //       await Promise.all([
    //         redisClient.set(`verify-email-${userId}`, token, "EX", 3600),
    //         redisClient.set(`token-verify-email-${token}`, userId, "EX", 3600),
    //       ]);
    //       await Mail.sendVerifyMail(user.email, `${user.last_name} ${user.first_name}`, token);
    //       res.status(200).send({ message: "Bạn vui lòng kiểm tra email" });
    //     }
    //   });
    // } catch (err) {
    //   res.status(500).send({ message: err.message });
    // }
  };

  public confirmVerifyEmail = async (req, res) => {
    // try {
    //   const { token } = req.query;
    //   if (!token) {
    //     return res.status(404).send({ message: "Token không tồn tại !" });
    //   }
    //   return redisClient.get(`token-verify-email-${token}`).then(async (result) => {
    //     if (result) {
    //       return UserRepository.update({
    //         user_id: result,
    //         email_verify: true,
    //       }).then(async (data) => {
    //         await Promise.all([
    //           redisClient.del(`verify-email-${result}`),
    //           redisClient.del(`token-verify-email-${token}`),
    //         ]);
    //         if (data) {
    //           res.status(301).redirect(process.env.URL_CLIENT);
    //         } else {
    //           return res.status(500).send({ message: "Xác thực thất bại" });
    //         }
    //       });
    //     } else {
    //       return res.status(404).send({ message: "Token không tồn tại !" });
    //     }
    //   });
    // } catch (err) {
    //   res.status(500).send({ message: err.message });
    // }
  };

}

const AuthenticationController = new Authentication();

export default AuthenticationController;
