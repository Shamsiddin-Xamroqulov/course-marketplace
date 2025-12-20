import { sequelize } from "../lib/connection/db.connection.js";
import Category from "./category/Category.model.js";
import Course from "./course/Course.model.js";
import Lesson from "./course/Lesson.model.js";
import Payment from "./purchase/Payment.model.js";
import Purchase from "./purchase/Purchase.model.js";
import RefreshToken from "./user/RefreshToken.model.js";
import Admin from "./user/Admin.model.js";
import Instructor from "./user/Instructor.model.js";
import User from "./user/User.model.js";
import Notification from "./user/Notification.model.js";

const UserModel = User(sequelize);
const AdminModel = Admin(sequelize);
const InstructorModel = Instructor(sequelize);
const RefreshTokenModel = RefreshToken(sequelize);
const PurchaseModel = Purchase(sequelize);
const PaymentModel = Payment(sequelize);
const CourseModel = Course(sequelize);
const LessonModel = Lesson(sequelize);
const CategoryModel = Category(sequelize);
const NotificationModel = Notification(sequelize);

// user.id=admin.user_id;
UserModel.hasOne(AdminModel, {foreignKey: "user_id", onDelete: "CASCADE"});
AdminModel.belongsTo(UserModel, {foreignKey: "user_id"});

// user.id=instructor.user_id;
UserModel.hasOne(InstructorModel, {foreignKey: "user_id", onDelete: "CASCADE"});
InstructorModel.belongsTo(UserModel, {foreignKey: "user_id"});

// user.id=refreshTokens.user_id;
UserModel.hasMany(RefreshTokenModel, {foreignKey: "user_id", onDelete: "CASCADE"}),
RefreshTokenModel.belongsTo(UserModel, {foreignKey: "user_id"});

// instructor.id = course.instructor_id
InstructorModel.hasMany(CourseModel, {foreignKey: "instructor_id", onDelete: "CASCADE"});
CourseModel.belongsTo(InstructorModel, {foreignKey: "instructor_id"});

// category.id=course.category_id;
CategoryModel.hasMany(CourseModel, {foreignKey: "category_id", onDelete: "CASCADE"});
CourseModel.belongsTo(CategoryModel, {foreignKey: "category_id"});

export {
  UserModel,
  AdminModel,
  InstructorModel,
  RefreshTokenModel,
  PurchaseModel,
  PaymentModel,
  CourseModel,
  LessonModel,
  CategoryModel,
  NotificationModel,
};
