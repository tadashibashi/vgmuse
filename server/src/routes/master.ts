/**
 * Master router that mounts all other routes
 */

import express, {Request, Response, NextFunction} from "express";
import {ServerError} from "../utilities/errors";

const router = express.Router();

import authRouter from "./api/auth";

router.use("/api/auth", authRouter);


// error handler
router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
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


router.all("*", (req, res, next) => {
    res.sendFile("/index.html");
});


export default router;
