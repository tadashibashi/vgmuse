import express from "express";
import * as authCtrl from "../../controllers/api/auth";
import * as formParser from "../../middleware/formParser";
import {loginRequired} from "../../middleware/loginRequired";

// Base URL: "/api/auth"
const router = express.Router();

router.post("/login", formParser.textOnly(), authCtrl.login);
router.post("/logout", authCtrl.logout);
router.post("/signup", formParser.textOnly(),  authCtrl.signup);

router.get("/activate/:token", authCtrl.activateAccount);

// updates user status, refreshing any expired user if there is a refresh-token
router.get("/refresh", authCtrl.refreshUser);

router.post("/resend-verification", loginRequired(), authCtrl.resendVerificationEmail);

router.post("/reset-password", authCtrl.resetPassword);

export default router;
