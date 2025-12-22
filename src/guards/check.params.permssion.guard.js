import { globalError } from "shokhijakhon-error-handler";

const checkParamsPermissionGuard = (req, res, next) => {
  try {
    const {id: authUserId, role, is_super_admin} = req.user;
    const {id} = req.params;
    if(role === "admin" && is_super_admin) return next();
    if(["admin", "student"].includes(role) && authUserId == id) return next();
    return res.status(403).json({message: "You are not allowed !", status: 403})
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

export default checkParamsPermissionGuard;