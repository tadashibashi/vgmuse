import express from "express";
import morgan from "morgan";
import router from "./routes/master";
import database from "./database";
import {getEnv, reqEnv} from "./env";

database.config();

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(express.static(process.cwd() + "/../frontend/dist"));
server.use("/", router);

// Dev port is 3000, production port is retrieved from `PORT` env var
const PRODUCTION = getEnv("PRODUCTION") === "true";
const PORT = PRODUCTION ? reqEnv("PORT") : 3000;

server.listen(PORT, () => {
    console.log("VGMuse server listening at http://localhost:" + PORT);
});
