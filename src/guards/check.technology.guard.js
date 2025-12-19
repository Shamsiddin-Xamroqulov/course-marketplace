import { globalError } from "shokhijakhon-error-handler";

const checkTechnologyGuard = (req, res, next) => {
  try {
    const { id: authUserId, role, is_super_admin } = req.user;
    const { id } = req.params;
    if (id) {
      if (role == "admin" && is_super_admin) return next();
      if (["admin", "instructor"].includes(role) && authUserId == id)
        return next();
    }
    if (role == "admin" && is_super_admin) return next();
    if (["admin", "instructor"].includes(role)) return next();
    return res.json({ message: "You are not allowed !", status: 403 });
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKNE_EXPIRED",
        message: "Access Token expired",
      });
    }
    return globalError(err, res);
  }
};

export default checkTechnologyGuard;
