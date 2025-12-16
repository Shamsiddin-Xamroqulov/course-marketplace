import { ClientError, globalError } from "shokhijakhon-error-handler";
import jwtService from "../lib/services/jwt.service.js";
import { UserModel } from "../models/index.js";

const checkTokenGuard = async (req, res, next) => {
    try{
        const accessToken = req.headers["authorization"].split(" ")[1];
        if(!accessToken) throw new ClientError("Unauthorized", 401);
        const decoded = jwtService.compareAccessToken(accessToken);
        const checkUser = await UserModel.findByPk(decoded.user_id);
        if(!checkUser) throw new ClientError("Invalid Token", 401);
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