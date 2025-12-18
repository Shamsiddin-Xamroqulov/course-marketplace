import { ClientError, globalError } from "shokhijakhon-error-handler";
import jwtService from "../lib/services/jwt.service.js";
import { AdminModel } from "../models/index.js";

const checkAdminGuard = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if(!token) throw new ClientError("Unauthorized Token required", 401);
        token = token.split(" ")[1];
        const decoded = jwtService.compareAccessToken(token);
        if(!(decoded.is_admin)) throw new ClientError("Yo are not admin", 403);
        const findAdmin = await AdminModel.findOne({where: {user_id: decoded.user_id}});
        if(!findAdmin) throw new ClientError("Invalid Token", 401);
        return next();
    }catch(err) {
        if(err.name == "TokenExpiredError") {
            return res.status(400).json({
                code: "TOKEN_EXPIRED",
                message: "Access Token expired !"
            });
        };
        return globalError(err, res);
    };
};

export default checkAdminGuard;