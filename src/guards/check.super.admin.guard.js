import { ClientError, globalError } from "shokhijakhon-error-handler";
import jwtService from "../lib/services/jwt.service.js";
import { AdminModel } from "../models/index.js";

const checkSuperAdminGuard = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if(!token) throw new ClientError("Unathorized Token required", 401);
    token = token.split(" ")[1];
    const decoded = jwtService.compareAccessToken(token);
    if(!(decoded.is_super_admin)) throw new ClientError("You are not SuperAdmin", 403);
    const checkSuperAdmin = await AdminModel.findOne({where: {user_id: decoded.user_id, is_super: true}});
    if(!checkSuperAdmin) throw new ClientError("Invalid Token", 403);
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

export default checkSuperAdminGuard;