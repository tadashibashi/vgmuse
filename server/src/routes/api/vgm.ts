import express from "express";
import * as vgmCtrl from "../../controllers/api/vgm";
import * as formParser from "../../middleware/formParser";
import {loginRequired} from "../../middleware/loginRequired";

// Base URL: "/api/vgm"
const router = express.Router();

router.get("/:username/:slug", vgmCtrl.readOne);
router.delete("/:username/:slug", loginRequired(), vgmCtrl.deleteOne);
router.post("/", formParser.files(), loginRequired(), vgmCtrl.createOne);
router.patch("/:username/:slug", loginRequired(), vgmCtrl.updateOne);

export default router;