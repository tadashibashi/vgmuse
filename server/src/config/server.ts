import express, {Express, Request, Response, NextFunction} from "express";
import morgan from "morgan";
import router from "../routes/master";
import cookieParser from "cookie-parser";
import {ServerError} from "../utilities/errors";
import injectUser from "../middleware/injectUser";

function config(server: Express) {
    server.use(morgan("dev"));
    server.use(cookieParser());
    server.use(injectUser());
    server.use(express.json());
    server.use(express.static(process.cwd() + "/../frontend/dist"),);
    server.use("/", router);


    // error handler
    server.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err)
        }

        if (err instanceof ServerError) {
            res.status(err.statusCode);
            res.statusMessage = err.message;

            console.error(err.stack);

        } else if (err instanceof Error) {
            res.status(500);
            console.error(err.stack);

        } else {
            res.status(500);
            console.error(err);

        }

        res.json({ error: err });
    });


}

export default config;
