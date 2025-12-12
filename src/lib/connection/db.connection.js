import { Sequelize } from "sequelize";
import serverConfig from "../../config.js";

const {
  database: { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER },
} = serverConfig;

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: false,
});

export async function dbConnection() {
    try {
        await sequelize.authenticate();
        console.log(`DB successfully connection !`);
        await sequelize.sync({alter: true});
    }catch(err) {
        throw new Error(err);
    };
};