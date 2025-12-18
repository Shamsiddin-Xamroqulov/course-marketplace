import { ClientError, globalError } from "shokhijakhon-error-handler";
import jwtService from "../lib/services/jwt.service";
import { UserModel } from "../models/index.js";

const checkStudentGuard = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if(!token) throw new ClientError("Unauthorized Token required", 401);
    token = token.split(" ")[1];
    const decoded = jwtService.compareAccessToken(token);
    if(!(decoded.is_student)) throw new ClientError("You are not Student", 403);
    const findStudent = await UserModel.findOne({where: {id: decoded.id}});
    if(!findStudent) throw new ClientError("Invalid Token", 401);
    return next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Access Token expired",
      });
    }
    return globalError(err, res);
  }
};

export default checkStudentGuard;