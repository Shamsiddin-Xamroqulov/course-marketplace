import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createUserSchema,
  loginSchema,
} from "../utils/validators/user.validator.js";
import { InstructorModel, RefreshTokenModel, UserModel } from "../models/index.js";
import otpGenerator from "../utils/generators/otp.generator.js";
import mailService from "../lib/services/mail.service.js";
import hashService from "../lib/services/hashing.service.js";
import {
  changePasswordSchema,
  resendSchema,
  verifySchema,
} from "../utils/validators/otp.validator.js";
import jwtService from "../lib/services/jwt.service.js";
import tokenDataGenerator from "../utils/generators/token.data.generator.js";

const { roles } = jwtService;

class AuthController {
  constructor() {
    this.register = async (req, res) => {
      try {
        const newUser = req.body;
        const { value, error } = createUserSchema.validate(newUser, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const checkUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (checkUser) throw new ClientError("User alredy exists", 400);
        const { otp, otpTime } = otpGenerator();
        await mailService(otp, value.email);
        const hashPassword = await hashService.hashingPassword(value.password);
        const user = await UserModel.create({
          ...value,
          otp,
          otp_time: otpTime,
          password: hashPassword,
        });
        if (user.role == "instructor") {
          await InstructorModel.create({
            user_id: user.id,
            bio: null,
          });
        }
        return res.status(201).json({
          success: true,
          message: "User successfully created !",
          status: 201,
          data: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            is_verified: user.is_verified,
          },
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.verify = async (req, res) => {
      try {
        const verifyData = req.body;
        const { error, value } = verifySchema.validate(verifyData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) throw new ClientError("User not found", 404);
        if (findUser.is_verified)
          throw new ClientError("User already verified", 409);
        if (value.otp !== findUser.otp)
          throw new ClientError("OTP invalid", 400);
        const now = Date.now();
        if (now > findUser.otp_time) {
          await UserModel.update(
            { otp: null, otp_time: null },
            { where: { email: value.email } }
          );
          throw new ClientError("OTP invalid !", 400);
        }
        await UserModel.update(
          { is_verified: true },
          { where: { email: value.email } }
        );
        return res.json({
          message: "User successfully verified !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.resendOtp = async (req, res) => {
      try {
        const otpData = req.body;
        const { error, value } = resendSchema.validate(otpData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) throw new ClientError("User not found", 404);
        if (findUser.is_verified)
          throw new ClientError("User alredy verified", 409);
        const { otp, otpTime } = otpGenerator();
        await mailService(otp, value.email);
        await UserModel.update(
          { otp, otp_time: otpTime },
          { where: { email: value.email } }
        );
        return res.json({
          message: "OTP has been sent, check your email !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.forgotPassword = async (req, res) => {
      try {
        const forgotData = req.body;
        const { error, value } = resendSchema.validate(forgotData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) throw new ClientError("User not founded", 404);
        await UserModel.update(
          { is_verified: false },
          { where: { email: value.email } }
        );
        const { otp, otpTime } = otpGenerator();
        await mailService(otp, value.email);
        await UserModel.update(
          { otp, otp_time: otpTime },
          { where: { email: value.email } }
        );
        return res.json({
          message: "OTP has been sent, check your email",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.change_password = async (req, res) => {
      try {
        const passwordData = req.body;
        const { error, value } = changePasswordSchema.validate(passwordData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) throw new ClientError("User not found", 404);
        if (findUser.is_verified)
          throw new ClientError("User already verified", 409);
        value.new_password = await hashService.hashingPassword(value.password);
        await UserModel.update(
          { password: value.new_password },
          { where: { email: value.email } }
        );
        return res.json({
          message: "Password successfully updated !",
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      }
    };
    this.login = async (req, res) => {
      try {
        const loginData = req.body;
        const { error, value } = loginSchema.validate(loginData, {
          abortEarly: false,
        });
        if (error) throw new ClientError(error.message, 400);
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) throw new ClientError("User not found", 404);
        const password = await hashService.comparePassword(
          value.password,
          findUser.password
        );
        if (!password) throw new ClientError("Password invalid", 400);
        let tokenData = {
          user_id: findUser.id,
          role: findUser.role,
          userAgent: req.headers["user-agent"],
          ...roles,
        };
        tokenData = await tokenDataGenerator(findUser, tokenData);
        const accessToken = jwtService.createAccessToken(tokenData);
        const refreshToken = jwtService.createRefreshToken(tokenData);
        await RefreshTokenModel.create({
          token: refreshToken,
          user_id: findUser.id,
          expires_at: new Date(Date.now() + jwtService.refreshTokenOptions.maxAge)
        });
        res.cookie(
          "refreshToken",
          refreshToken,
          jwtService.refreshTokenOptions
        );
        return res.json({
          message: "User successfully logged in !",
          accessToken,
          status: 200,
        });
      } catch (err) {
        return globalError(err, res);
      };
    };
    this.refresh_token = async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) throw new ClientError("Token not found", 404);
        let payload = jwtService.compareRefreshToken(refreshToken);
        if(req.headers["user-agent"] != payload.userAgent) throw new ClientError("Invalid token", 401);
        let user = await UserModel.findOne({where: {id: payload.user_id}});
        if(!user) throw new ClientError("Invalid token", 401);
        const findToken = await RefreshTokenModel.findOne({where: {token: refreshToken, user_id: user.id}});
        if(!findToken) throw new ClientError("Invalid token", 401);
        const tokenData = {user_id: user.id, role: user.role, userAgent: req.headers["user-agent"], ...roles};
        tokenData = await tokenDataGenerator(user, tokenData);
        let newAccessToken = jwtService.createAccessToken(tokenData);
        return res.json({message: "AccessToken successfully generated !", newAccessToken, status: 200});
      }catch(err) {
        return globalError(err, res);
      }; 
    };
  };
};

export default new AuthController();
