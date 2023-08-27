import busboy, {FileInfo} from "busboy";
import {InvalidRequestError} from "../lib/errors";
import stream from "stream";

/**
 * Parse header containing FormData, made available in `req.body`
 */
export const textOnly = function() {
    return function(req, res, next) {
        try {

            const bb = busboy({headers: req.headers});

            const body: Record<string, string> = {};

            bb.on("field", (field, value) => {
                body[field] = value;
            });
            bb.on("close", () => {
                req.body = body;

                next();
            });

            req.pipe(bb);

        } catch(err) {
            next(err);
        }
    }  as VGMuse.MiddlewareFunction;
}


interface FilesOpts {
    limits?: busboy.Limits;
    fileFilter?: (name: string, stream: NodeJS.ReadableStream, info: FileInfo) => boolean;
}

/**
 * Injects `req.files` with buffers of the files uploaded from the frontend
 * @param opts
 */
export const files = function(opts?: FilesOpts) {
    return function(req, res, next) {
        const files: Record<string, VGMuse.FileData> = {};
        const body: Record<string, string | busboy.Info> = {};

        try {
            const bb = busboy({headers: req.headers, limits: opts?.limits});

            bb.on("field", (name, value) => {
                body[name] = value;
            });

            bb.on("file", (name, strm, info) => {
                const chunks: Array<Uint8Array> = [];

                strm.on("data", chunk => chunks.push(chunk));
                strm.on("close", () => {
                    files[name] = {
                        buffer: Buffer.concat(chunks),
                        filename: info.filename,
                        mimetype: info.mimeType,
                        encoding: info.encoding,
                    };
                });
            });

            bb.on("filesLimit", () => {
                next(new InvalidRequestError("Files limit exceeded"));
            });

            bb.on("fieldsLimit", () => {
                next(new InvalidRequestError("Fields limit exceeded"));
            });

            bb.on("close", () => {
                req.files = files;
                req.body = body;
                next();
            });

            req.pipe(bb);
        }
        catch (err) {
            next(err);
        }

    } as VGMuse.MiddlewareFunction;
}

export default {
    textOnly,
};
