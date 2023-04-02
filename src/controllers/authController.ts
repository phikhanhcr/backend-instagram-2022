import { checkPassword, hashPassword } from "./../utils/crypt";

import jwt from "jsonwebtoken";
import UserRepositories from "../db/repositories/UserReponsitories";
import httpStatus from "http-status";
class Authentication {
  public getUserByToken = async (req, res) => {
    const userId = req.user;
    const user = await UserRepositories.get(userId);
    return res.status(200).send({
      message: "Đăng nhập thành công",
      user: JSON.stringify(user),
      status: true,
    });
  };

  public register = async (req, res) => {
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "Vui lòng nhập đầy đủ thông tin !" });
      }
      const regex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
      if (!regex.test(email)) {
        return res.status(500).send({ message: "Email không hợp lệ !" });
      }
      const user = await UserRepositories.findByEmail(email);
      if (user) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "Email đã tồn tại trong hệ thống" });
      }
      if (password.length < 6) {
        return res
          .status(500)
          .send({ message: "Mật khẩu phải dài hơn 6 ký tự" });
      }
      if (password.length > 25) {
        return res
          .status(500)
          .send({ message: "Mật khẩu phải ngắn hơn 25 ký tự" });
      }
      const newUser = await UserRepositories.create({
        email,
        password: await hashPassword(password),
        username,
      });

      const jsonWebToken = jwt.sign(
        { userID: newUser._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      const refreshToken = jwt.sign(
        { userID: newUser._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "1y",
        }
      );

      return res.status(200).send({
        message: "oke",
        token: jsonWebToken,
        refreshToken,
        user: JSON.stringify(user),
        status: true,
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  public login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(500).send({
          message: "Vui lòng nhập đầy đủ thông tin !",
          status: "false",
        });
      }
      const userByEmail = await UserRepositories.getPasswordByEmail(email);
      const userByUsername = await UserRepositories.getPasswordByUserName(
        email
      );
      if (!userByUsername && !userByEmail) {
        return res.status(500).send({
          message: "Tên đăng nhập hoặc mật khẩu không đúng!",
          status: false,
        });
      }
      const user = userByUsername ? userByUsername : userByEmail;
      const checkPasswordInput = await checkPassword(password, user.password);
      if (!checkPasswordInput) {
        return res.status(500).send({
          message: "Có cái mật khẩu không nhớ được là sao, buddy?",
          status: false,
        });
      }

      const jsonWebToken = jwt.sign(
        { userID: user._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      const refreshToken = jwt.sign(
        { userID: user._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "1y",
        }
      );

      return res.status(200).send({
        message: "Đăng nhập thành công",
        token: jsonWebToken,
        refreshToken,
        user: JSON.stringify(user),
        status: true,
      });
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
}

const AuthenticationController = new Authentication();

export default AuthenticationController;
