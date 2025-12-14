import { ClientError, globalError } from "shokhijakhon-error-handler";
import { createUserSchema } from "../utils/validators/user.validator.js";
import { InstructorModel, UserModel } from "../models/index.js";
import otpGenerator from "../utils/generators/otp.generator.js";
import mailService from "../lib/services/mail.service.js";
import hashService from "../lib/services/hashing.service.js";
import { resendSchema, verifySchema } from "../utils/validators/otp.validator.js";

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
        if (checkUser) throw new ClientError("User alredy exists !", 400);
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
        const {error, value} = verifySchema.validate(verifyData, {abortEarly: false});
        if(error) throw new ClientError(error.message, 400);
        const checkUser = await UserModel.findOne({where: {email: value.email}});
        if(!checkUser) throw new ClientError("User not found !", 404);
        if(checkUser.is_verified) throw new ClientError("User already verified !", 409);
        if(value.otp !== checkUser.otp) throw new ClientError("OTP invalid !", 400);
        const now = Date.now();
        if(now > checkUser.otp_time) {
          await UserModel.update({otp: null, otp_time: null}, {where: {email: value.email}});
          throw new ClientError("OTP invalid !", 400);
        };
        await UserModel.update({is_verified: true}, {where: {email: value.email}});
        return res.json({message: "User successfully verified !", status: 200});
      } catch (err) {
        return globalError(err, res);
      };
    };
    this.resendOtp = async (req, res) => {
      try {
          const otpData = req.body;
          const {error, value} = resendSchema.validate(otpData, {abortEarly: false});
          if(error) throw new ClientError(error.message, 400);
          const checkUser = await UserModel.findOne({where: {email: value.email}});
          if(!checkUser) throw new ClientError("User not found !", 404);
          if(checkUser.is_verified) throw new ClientError("User alredy verified !", 409);
          const {otp, otpTime} = otpGenerator();
          await mailService(otp, value.email);
          await UserModel.update({otp, otp_time: otpTime}, {where: {email: value.email}});
          return res.json({message: "OTP has been sent, check your email", status: 200});
      }catch(err) {
        return globalError(err, res);
      };
    };
    // this.forgotPassword = async (req, res) => {
    //   try{

    //   }catch(err) {
    //     return globalError(err, res);
    //   };
    // };
  };
};

export default new AuthController();
