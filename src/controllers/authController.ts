import { checkPassword, hashPassword } from './../utils/crypt';

import jwt from "jsonwebtoken";
import UserRepositories from '../db/repositories/UserReponsitories'
import env from '../config/env';
import { getUserIdFromReq, isAuthenticated } from '../utils/isAuthenticated';
class Authentication {

  public getUserByToken = async (req, res) => {
    const check = await isAuthenticated(req, res);
    if (check) {
      // decode token
      const userId = await getUserIdFromReq(req);
      const user = await UserRepositories.get(userId);
      return res.status(200).send({ message: "Đăng nhập thành công", user: JSON.stringify(user), status: true });
    }
    return res.status(500).json({ 
      message : "Token expired, Please try again"
    })
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
      const newUser = await UserRepositories.create({
        email,
        password: await hashPassword(password),
        username
      });
      // send mail 
      return res.status(200).json({ message: "oke" })

      // if (newUser) {
      //   await createJob({
      //     repository: "Mail",
      //     action: "sendMailWelcome",
      //     email,
      //     name: `${lastName} ${firstName}`,
      //   });
      //   req.login(newUser, (err) => {
      //     if (!err) {
      //       res.cookie(
      //         "user",
      //         {
      //           _id: newUser._id.toString(),
      //           avatar: newUser.avatar,
      //           email: newUser.email,
      //           facebook_id: newUser.facebook_id,
      //           first_name: newUser.first_name,
      //           google_avatar: newUser.google_avatar,
      //           google_id: newUser.google_id,
      //           last_name: newUser.last_name,
      //           zalo_id: newUser.zalo_id,
      //           working_area: {
      //             city: false,
      //             district: false,
      //             ward: false,
      //             ad_sell_lease_type: false,
      //             ad_sell_lease_type_option: false,
      //             project: false,
      //           },
      //         },
      //         {
      //           domain: process.env.COOKIE_DOMAIN,
      //           maxAge: Number(process.env.COOKIE_AGE),
      //           httpOnly: false,
      //         }
      //       );
      //       const jsonWebToken = jwt.sign({ userID: newUser._id.toString() }, process.env.JWT_SECRET, {
      //         expiresIn: Number(process.env.COOKIE_AGE) / 1000,
      //       });
      //       res.cookie("jwt", jsonWebToken, {
      //         domain: process.env.COOKIE_DOMAIN,
      //         httpOnly: false,
      //       });
      //       return res.status(200).send({ message: "Đăng ký thành công", mobile_token: jsonWebToken});
      //     } else {
      //       return res.status(500).send({ message: err.message });
      //     }
      //   });
      // } else {
      //   return res.status(500).send({ message: "Không thể tạo được tài khoản mới" });
      // }
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

      req.login(user, (err) => {
        if (!err) {
          res.cookie(
            "user",
            {
              _id: user._id.toString(),
              avatar: user.avatar,
              email: user.email,
              username: user.username ? user.username : user.email,
            },
            {
              domain: process.env.COOKIE_DOMAIN,
              maxAge: Number(process.env.COOKIE_AGE),
              httpOnly: false,
              signed: true
            }
          );
          const jsonWebToken = jwt.sign({ userID: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: Number(process.env.COOKIE_AGE) / 1000,
          });
          res.cookie("jwt", jsonWebToken, {
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: false,
            signed: true
          });

          return res.status(200).send({ message: "Đăng nhập thành công", token: jsonWebToken, user: JSON.stringify(user), status: true });
        } else {
          return res.status(500).send({ message: err.message, status: false });
        }
      });
    } catch (err) {
      return res.status(500).send({ message: err.message, status: false });
    }
  };

  public changePassword = async (req, res) => {
    // try {
    //   if (!(await isAuthenticated(req, res))) {
    //     return res.status(500).send({ message: "Bạn chưa đăng nhập !" });
    //   }
    //   const { password, newPassword } = req.body;
    //   if (!newPassword || !password) {
    //     return res.status(500).send({ message: "Vui lòng nhập đầy đủ thông tin !" });
    //   }
    //   if (newPassword.length < 6) {
    //     return res.status(500).send({ message: "Mật khẩu mới phải dài hơn 6 ký tự" });
    //   }
    //   if (newPassword.length > 25) {
    //     return res.status(500).send({ message: "Mật khẩu mới phải ngắn hơn 25 ký tự" });
    //   }
    //   const userId = await getUserIdFromRequest(req);
    //   const user = await UserRepository.getPasswordById(userId);
    //   const checkPasswordInput = await checkPassword(password, user.password);
    //   if (checkPasswordInput) {
    //     return UserRepository.update({
    //       user_id: userId,
    //       password: await hashPassword(newPassword),
    //     }).then((data) => {
    //       if (data) {
    //         return res.status(200).send({ message: "Đổi mật khẩu thành công" });
    //       } else {
    //         return res.status(500).send({ message: "Đổi mật khẩu thất bại, vui lòng thử lại !" });
    //       }
    //     });
    //   } else {
    //     return res.status(500).send({ message: "Mật khẩu không đúng !" });
    //   }
    // } catch (err) {
    //   res.status(500).send({ message: err.message });
    // }
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
