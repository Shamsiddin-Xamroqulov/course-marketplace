import express from "express";
import serverConfig from "./config.js";
import mainRouter from "./routes/main.routes.js";
const {server: {PORT}} = serverConfig;



const app = express();

app.use(express.json());
app.use("/api", mainRouter);

async function start() {
    try{
        app.listen(PORT, () => console.log(`Server is running on http://127.0.0.1:${4000}`));
    }catch(err) {
        console.log(`Server failed run ${err}`);
    };
};

start();