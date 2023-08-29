import express from "express";
import * as vgmCtrl from "../../controllers/api/vgm";
import * as formParser from "../../middleware/formParser";
import {loginRequired} from "../../middleware/loginRequired";

// Base URL: "/api/vgm"
const router = express.Router();

router.get("/:username", vgmCtrl.readAll);
router.get("/:username/:slug", vgmCtrl.readOne);
router.delete("/:username/:slug", loginRequired(), vgmCtrl.deleteOne);
router.post("/", loginRequired(), formParser.files({limits: {fileSize: 2000000}}), vgmCtrl.createOne);
router.patch("/:username/:slug", loginRequired(), formParser.files(), vgmCtrl.updateOne);

router.get("/", vgmCtrl.search);

export default router;