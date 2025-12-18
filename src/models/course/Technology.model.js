import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Technology = sequelize.define("Technology", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "Technology",
    timestamp: true,
  });
  return Technology
};