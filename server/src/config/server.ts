import express, {Express, Request, Response, NextFunction} from "express";
import morgan from "morgan";
import router from "../routes/master";
import cookieParser from "cookie-parser";
import {ServerError} from "../lib/errors";
import injectUser from "../middleware/injectUser";
import mongoose from "mongoose";
import {PRODUCTION} from "../lib/jwt/constants";

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

        } else if (err instanceof mongoose.Error.ValidationError) {
            // probably should be caught by the controller
            res.status(400);
            console.log(err.stack);

            if (PRODUCTION)
                return res.json({error: true});
            else
                return res.json(err);

        } else if (err instanceof Error) {
            res.status(500);
            console.error(err.stack);

        } else {
            res.status(500);
            console.error(err);

        }

        if (PRODUCTION) // don't want to pass sensitive debug info to the client during production
            res.json({ error: true });
        else
            res.json({error: err});
    });


}

export default config;
