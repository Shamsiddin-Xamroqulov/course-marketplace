import { ClientError, globalError } from "shokhijakhon-error-handler";
import jwtService from "../lib/services/jwt.service.js";
import { UserModel } from "../models/index.js";

const checkTokenGuard = async (req, res, next) => {
    try{
        let accessToken = req.headers["authorization"];
        if(!accessToken) throw new ClientError("Unauthorized Token required", 401);
        accessToken = accessToken.split(" ")[1];
        const decoded = jwtService.compareAccessToken(accessToken);
        const checkUser = await UserModel.findByPk(decoded.user_id);
        if(!checkUser) throw new ClientError("Invalid Token", 401);
        if(req.headers["user-agent"] != decoded.userAgent) throw new ClientError("Invalid Token", 401);
        req.user = decoded;
        return next();
    }catch(err) {
        if(err.name == "TokenExpiredError") {
            return res.status(401).json({
                code: "TOKEN_EXPIRED",
                message: "Access Token expired !"
            });
        };
        return globalError(err, res);
    };
};

export default checkTokenGuard;