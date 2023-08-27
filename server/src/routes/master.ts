/**
 * Master router that mounts all other routes
 */

import express from "express";
import {ServerError} from "../lib/errors";
import path from "path";

const router = express.Router();

import vgmRouter from "./api/vgm";
import authRouter from "./api/auth";

router.use("/api/auth", authRouter);
router.use("/api/vgm", vgmRouter);

router.all("*", (req, res, next) => {
    res.sendFile(path.join(process.cwd() + "/../frontend/dist/index.html"));
});


export default router;
