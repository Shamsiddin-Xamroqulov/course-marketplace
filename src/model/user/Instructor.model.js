import { DataTypes } from "sequelize";
import { sequelize } from "../../lib/connection/db.connection.js"

const InstructorModel = sequelize.define('Instructor', {
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
    allowNull: false,
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'instructors',
  timestamps: true,
});

export default InstructorModel;