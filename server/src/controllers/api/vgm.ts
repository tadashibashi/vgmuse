import {uploadFile} from "../../api/s3";
import {FormError, InternalError, InvalidRequestError} from "../../lib/errors";
import Vgm from "../../models/Vgm";
import mongoose, {HydratedDocument} from "mongoose";
import path from "path";
import {User} from "../../models";

/**
 * Create a VGM file
 * POST /api/vgm/
 *
 * files uploaded to s3: /users/:userId/vgm/:vgmId/
 * - vgm file: <slugified filename>.<ext>
 * - coverart: coverart.<ext>
 */
export const createOne = async function(req, res, next) {
    const files = req.files;
    if (!files) return next(new InternalError("Missing files in request"));

    const user = req.user;
    if (!user) return next(new InternalError("Missing user in request"));

    // create vgm
    let vgm: HydratedDocument<VGMuse.IVgm>;
    try {
        vgm = new Vgm(req.body);
        vgm.user = user._id;
        await vgm.save();
    } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.json(e);
        }
        return next(e);
    }


    const file = files["file-upload"];
    if (!file || !file.buffer.length) {
        const error = new FormError();
        error.pushError("file-upload", "Missing file upload");
        await vgm.deleteOne();
        return res.json(error);
    }

    if (!file.filename) {
        const error = new FormError();
        error.pushError("file-upload", "Missing filename");
        await vgm.deleteOne();
        return res.json(error);
    }

    // construct folder path
    const folder = `/users/${user._id}/vgm/${vgm._id}/`;
    const vgmFilename = `${vgm.slug}${path.extname(file.filename)}`;
    const fileKey = folder + vgmFilename;


    try {
        await uploadFile(folder + vgmFilename, file.buffer);
        vgm.fileKey = fileKey;
        await vgm.save();
    } catch(e) {
        const error = new FormError();
        if (e instanceof Error)
            error.pushError("file-upload", e.message);
        else
            error.pushError("file-upload", "failed to upload file");

        await vgm.deleteOne();
        return res.json(error);
    }

    return res.json(vgm);

} as VGMuse.MiddlewareFunction;


/**
 * Search for VGM files
 * GET /api/vgm/search
 * Query parameters: q, search string
 */
export const search = function(req, res, next) {
    const q = req.params["q"];

    // default, no q param gets latest tracks


} as VGMuse.MiddlewareFunction;

/**
 * Update one VGM file
 * PATCH /api/vgm/:username/:slug
 */
export const updateOne = function(req, res, next) {



} as VGMuse.MiddlewareFunction;

/**
 * Delete one VGM file
 * DELETE /api/vgm/:username/:slug
 */
export const deleteOne = function(req, res, next) {



} as VGMuse.MiddlewareFunction;

/**
 * Read one VGM file
 * GET /api/vgm/:username/:slug
 */
export const readOne = function(req, res, next) {



} as VGMuse.MiddlewareFunction;


/**
 * Read a user's VGM files
 * GET /api/vgm/:username
 */
export const readAll = async function(req, res, next) {

    const username = req.params["username"];
    const user = await User.findOne({username});

    if (!user)
        return res.status(404).json("resources could not be found");

    try {
        const vgms = await Vgm.find({user: user._id});
        return res.json(vgms);
    } catch(err) {
        return next(err);
    }

} as VGMuse.MiddlewareFunction;