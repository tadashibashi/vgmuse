import express from "express";
import * as authCtrl from "../../controllers/api/auth";
import * as formParser from "../../middleware/formParser";

// Base URL: "/auth"
const router = express.Router();

router.post("/login", formParser.textOnly(), authCtrl.login);
router.post("/logout", authCtrl.logout);
router.post("/signup", formParser.textOnly(),  authCtrl.signup);

export default router;