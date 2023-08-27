import {uploadFile} from "../../api/s3";
import {InvalidRequestError} from "../../lib/errors";

/**
 * Create a VGM file
 * POST /api/vgm/
 */
export const createOne = async function(req, res, next) {
    if (!req.files) return next(new InvalidRequestError("missing files"));

    const file = req.files["file-upload"];
    if (file && file.buffer.length) {
        await uploadFile(file.filename, file.buffer);
    }

    return res.json(req.files);

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
export const readAll = function(req, res, next) {



} as VGMuse.MiddlewareFunction;