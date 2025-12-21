import express from "express";
import cors from "cors";
import serverConfig from "./config.js";
import mainRouter from "./routes/main.routes.js";
import cookieParser from "cookie-parser";
import { dbConnection } from "./lib/connection/db.connection.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerDocs from "./docs/swagger.docs.js";

const {
  server: { PORT },
} = serverConfig;

dbConnection().catch((err) => {
  console.log(err);
  process.exit(1);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api", mainRouter);
app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerDocs)
);

async function start() {
  try {
    app.listen(PORT, () =>
      console.log(`Server is running on http://127.0.0.1:${4000}`)
    );
  } catch (err) {
    console.log(`Server failed run ${err}`);
  }
}

start();
