/**
 * Master router that mounts all other routes
 */

import express from "express";
const router = express.Router();

router.all("*", (req, res, next) => {
    res.sendFile("/index.html");
});

export default router;
