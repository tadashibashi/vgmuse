import express, {Express} from "express";
import morgan from "morgan";
import router from "../routes/master";
import cookieParser from "cookie-parser";

function config(server: Express) {
    server.use(morgan("dev"));
    server.use(cookieParser());
    server.use(express.json());
    server.use(express.static(process.cwd() + "/../frontend/dist"));
    server.use("/", router);
}

export default config;
