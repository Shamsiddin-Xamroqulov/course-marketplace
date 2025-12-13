import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Instructor = sequelize.define("Instructor", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
    },
    {
      tableName: "instructors",
      timestamps: true,
    },
  );
  return Instructor
};