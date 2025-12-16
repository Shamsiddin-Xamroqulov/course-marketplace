
const checkAdminGuard = (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        console.log(token);
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