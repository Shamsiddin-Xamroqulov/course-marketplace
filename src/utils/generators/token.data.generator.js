import { ClientError } from "shokhijakhon-error-handler";
import { AdminModel, InstructorModel } from "../../models/index.js";

const tokenDataGenerator = async (findUser, tokenData) => {
  if (findUser.role == "student") {
    return {
      ...tokenData,
      is_student: true,
      id: findUser.id
    };
  }
  if (findUser.role == "instructor") {
    const instructor = await InstructorModel.findOne({
      where: { user_id: findUser.id },
      attributes: ["id"]
    });
    if (!instructor) throw new ClientError("Instructor not found !", 404);
    return {
      ...tokenData,
      is_instructor: true,
      id: instructor.id,
    };
  }
  if (findUser.role == "admin") {
    const admin = await AdminModel.findOne({
      where: { user_id: findUser.id },
      attributes: ["id", "is_super"]
    });
    if(!admin) throw new ClientError("Admin not found !", 404);
    return {
        ...tokenData,
        is_admin: true,
        is_super_admin: admin.is_super,
        id: admin.id
    };
  };
};

export default tokenDataGenerator;
