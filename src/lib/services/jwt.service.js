import jwt from "jsonwebtoken";
import serverConfig from "../../config.js";
const {token_service: {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY}, NODE_ENV} = serverConfig;

const jwtService = {
    createAccessToken: (payload) => jwt.sign(payload, ACCESS_TOKEN_KEY, {expiresIn: "1d"}),
    verifyAccessToken: (token) => jwt.verify(token, ACCESS_TOKEN_KEY),
    crateRefreshToken: (payload) => jwt.sign(payload, REFRESH_TOKEN_KEY, { expiresIn: "30d" }),
    verifyRefreshToken: (token) => jwt.verify(token, REFRESH_TOKEN_KEY),
    refreshTokenOptions: {
        maxAge: 30 * 24 * 60 * 1000,
        httpOnly: true,
        secure: NODE_ENV == "production",
        sameSite: "strict"
    },
    roles: {is_admin: false, is_instructor: false, is_student: false, is_super_admin: false}
};

export default jwtService;