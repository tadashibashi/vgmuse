import express from "express";
import * as vgmCtrl from "../../controllers/api/vgm";
import * as formParser from "../../middleware/formParser";
import {loginRequired} from "../../middleware/loginRequired";

// Base URL: "/api/vgm"
const router = express.Router();

router.get("/:username/:slug", vgmCtrl.readOne);
router.delete("/:username/:slug", vgmCtrl.deleteOne);
router.post("/", formParser.files(), vgmCtrl.createOne);
router.patch("/:username/:slug", vgmCtrl.updateOne);
