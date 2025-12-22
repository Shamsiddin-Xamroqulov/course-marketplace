import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  createUserSchema,
  loginSchema,
} from "../utils/validators/user.validator.js";
import {
  InstructorModel,
  RefreshTokenModel,
  UserModel,
} from "../models/index.js";
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
import logger from "../lib/services/logger.service.js";

const { roles } = jwtService;

class AuthController {
  constructor() {
    this.register = async (req, res) => {
      try {
        logger.info("Register user request received");
        const newUser = req.body;
        const { value, error } = createUserSchema.validate(newUser, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`User registration validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const checkUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (checkUser) {
          logger.warn(`User already exists | email=${value.email}`);
          throw new ClientError("User already exists", 409);
        }
        const { otp, otpTime } = otpGenerator();
        await mailService(otp, value.email);
        logger.info(`OTP sent to user | email=${value.email}`);
        const hashPassword = await hashService.hashingPassword(value.password);
        logger.info(`Password hashed for user | email=${value.email}`);
        const user = await UserModel.create({
          ...value,
          otp,
          otp_time: otpTime,
          password: hashPassword,
        });
        if (user.role == "instructor") {
          logger.info(`Instructor profile created | user_id=${user.id}`);
          await InstructorModel.create({
            user_id: user.id,
            bio: null,
          });
        }
        logger.info(
          `User successfully registered | user_id=${user.id} | role=${user.role}`
        );
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
        logger.error(`Register user error: ${err.message}`);
        return globalError(err, res);
      }
    };
    this.verify = async (req, res) => {
      try {
        logger.info("User verification request received");
        const verifyData = req.body;
        const { error, value } = verifySchema.validate(verifyData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`User verification validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) {
          logger.warn(
            `User not found during verification | email=${value.email}`
          );
          throw new ClientError("User not found", 404);
        }
        if (findUser.is_verified) {
          logger.warn(`User already verified | email=${value.email}`);
          throw new ClientError("User already verified", 409);
        }
        if (value.otp !== findUser.otp) {
          logger.warn(`Invalid OTP attempt | email=${value.email}`);
          throw new ClientError("OTP invalid", 400);
        }
        const now = Date.now();
        if (now > findUser.otp_time) {
          logger.warn(`OTP expired | email=${value.email}`);
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
        logger.info(`User successfully verified | email=${value.email}`);
        return res.json({
          message: "User successfully verified !",
          status: 200,
        });
      } catch (err) {
        logger.error(
          `User verification error | email=${req.body.email} | ${err.message}`
        );
        return globalError(err, res);
      }
    };
    this.resendOtp = async (req, res) => {
      try {
        logger.info("Resend OTP request received");
        const otpData = req.body;
        const { error, value } = resendSchema.validate(otpData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Resend OTP validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) {
          logger.warn(
            `User not found during OTP resend | email=${value.email}`
          );
          throw new ClientError("User not found", 404);
        }
        if (findUser.is_verified) {
          logger.warn(`User already verified | email=${value.email}`);
          throw new ClientError("User alredy verified", 409);
        }
        const { otp, otpTime } = otpGenerator();
        await mailService(otp, value.email);
        logger.info(`OTP sent to user | email=${value.email}`);
        await UserModel.update(
          { otp, otp_time: otpTime },
          { where: { email: value.email } }
        );
        logger.info(`OTP updated in database | email=${value.email}`);
        logger.info(
          `OTP resend process completed successfully | email=${value.email}`
        );
        return res.json({
          message: "OTP has been sent, check your email !",
          status: 200,
        });
      } catch (err) {
        logger.error(
          `Resend OTP error | email=${req.body.email} | ${err.message}`
        );
        return globalError(err, res);
      }
    };
    this.forgotPassword = async (req, res) => {
      try {
        logger.info("Forgot password request received");
        const forgotData = req.body;
        const { error, value } = resendSchema.validate(forgotData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Forgot password validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) {
          logger.warn(
            `User not found during forgot password | email=${value.email}`
          );
          throw new ClientError("User not founded", 404);
        }
        await UserModel.update(
          { is_verified: false },
          { where: { email: value.email } }
        );
        logger.info(`User marked as not verified | email=${value.email}`);
        const { otp, otpTime } = otpGenerator();
        await mailService(otp, value.email);
        logger.info(
          `OTP sent to user for forgot password | email=${value.email}`
        );
        await UserModel.update(
          { otp, otp_time: otpTime },
          { where: { email: value.email } }
        );
        logger.info(
          `OTP updated in database for forgot password | email=${value.email}`
        );
        logger.info(
          `Forgot password process completed successfully | email=${value.email}`
        );
        return res.json({
          message: "OTP has been sent, check your email",
          status: 200,
        });
      } catch (err) {
        logger.error(
          `Forgot password error | email=${req.body.email} | ${err.message}`
        );
        return globalError(err, res);
      }
    };
    this.change_password = async (req, res) => {
      try {
        logger.info("Change password request received");
        const passwordData = req.body;
        const { error, value } = changePasswordSchema.validate(passwordData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Change password validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) {
          logger.warn(
            `User not found during password change | email=${value.email}`
          );
          throw new ClientError("User not found", 404);
        }
        if (findUser.is_verified) {
          logger.warn(
            `User already verified, cannot change password | email=${value.email}`
          );
          throw new ClientError("User already verified", 409);
        }
        value.new_password = await hashService.hashingPassword(value.password);
        logger.info(`Password hashed for user | email=${value.email}`);
        await UserModel.update(
          { password: value.new_password },
          { where: { email: value.email } }
        );
        logger.info(
          `Password successfully updated in database | email=${value.email}`
        );
        logger.info(
          `Password change process completed successfully | email=${value.email}`
        );
        return res.json({
          message: "Password successfully updated !",
          status: 200,
        });
      } catch (err) {
        logger.error(
          `Change password error | email=${req.body.email} | ${err.message}`
        );
        return globalError(err, res);
      }
    };
    this.login = async (req, res) => {
      try {
        logger.info("Login request received");
        const loginData = req.body;
        const { error, value } = loginSchema.validate(loginData, {
          abortEarly: false,
        });
        if (error) {
          logger.warn(`Login validation failed: ${error.message}`);
          throw new ClientError(error.message, 400);
        }
        const findUser = await UserModel.findOne({
          where: { email: value.email },
        });
        if (!findUser) {
          logger.warn(`User not found during login | email=${value.email}`);
          throw new ClientError("User not found", 404);
        }
        const password = await hashService.comparePassword(
          value.password,
          findUser.password
        );
        if (!password) {
          logger.warn(`Invalid password attempt | email=${value.email}`);
          throw new ClientError("Password invalid", 400);
        }
        let tokenData = {
          user_id: findUser.id,
          role: findUser.role,
          userAgent: req.headers["user-agent"],
          ...roles,
        };
        logger.info(`Generating tokens for user | email=${value.email}`);
        tokenData = await tokenDataGenerator(findUser, tokenData);
        const accessToken = jwtService.createAccessToken(tokenData);
        const refreshToken = jwtService.createRefreshToken(tokenData);
        await RefreshTokenModel.create({
          token: refreshToken,
          user_id: findUser.id,
          expires_at: new Date(
            Date.now() + jwtService.refreshTokenOptions.maxAge
          ),
        });
        res.cookie(
          "refreshToken",
          refreshToken,
          jwtService.refreshTokenOptions
        );
        logger.info(
          `User logged in successfully | user_id=${findUser.id} | role=${findUser.role}`
        );
        return res.json({
          message: "User successfully logged in !",
          status: 200,
          accessToken,
        });
      } catch (err) {
        logger.error(`Login error | email=${req.body.email} | ${err.message}`);
        return globalError(err, res);
      }
    };
    this.refresh_token = async (req, res) => {
      try {
        logger.info("Refresh token request received");
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          logger.warn("Refresh token not found in cookies");
          throw new ClientError("Token not found", 404);
        }
        let payload = jwtService.compareRefreshToken(refreshToken);
        if (req.headers["user-agent"] != payload.userAgent) {
          logger.warn(
            `Invalid refresh token: User-Agent mismatch | expected=${payload.userAgent} | received=${req.headers["user-agent"]}`
          );
          throw new ClientError("Invalid token", 401);
        }
        let user = await UserModel.findOne({ where: { id: payload.user_id } });
        if (!user) {
          logger.warn(
            `User not found during refresh token | user_id=${payload.user_id}`
          );
          throw new ClientError("Invalid token", 401);
        }
        const findToken = await RefreshTokenModel.findOne({
          where: { token: refreshToken, user_id: user.id },
        });
        if (!findToken) {
          logger.warn(`Refresh token invalid or revoked | user_id=${user.id}`);

          throw new ClientError("Invalid token", 401);
        }
        const tokenData = {
          user_id: user.id,
          role: user.role,
          userAgent: req.headers["user-agent"],
          ...roles,
        };
        tokenData = await tokenDataGenerator(user, tokenData);
        let newAccessToken = jwtService.createAccessToken(tokenData);
        logger.info(
          `Access token successfully generated | user_id=${user.id} | role=${user.role}`
        );
        return res.json({
          message: "AccessToken successfully generated !",
          newAccessToken,
          status: 200,
        });
      } catch (err) {
        logger.error(`Refresh token error | ${err.message}`);
        return globalError(err, res);
      }
    };
  }
}

export default new AuthController();
