import { sequelize } from "../../lib/connection/db.connection.js";
import { DataTypes } from "sequelize";

const AdminModel = sequelize.define("Admin", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_super: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "admins",
    timestamps: true,
});

export default AdminModel;