import busboy, {FileInfo} from "busboy";
import {InvalidRequestError} from "../lib/errors";

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

            // error helper, stops upload process, sends error to client-side
            // make sure all messages contain client-presentable messages.
            async function throwError<T extends Error>(error: T) {
                req.unpipe(bb);
                return res.json(error);
            }

            // non-file field listener
            bb.on("field", (name, value) => {
                body[name] = value;
            });

            // file field listener
            bb.on("file", (name, fileStrm, info) => {

                // collect chunks of file data
                const chunks: Array<Uint8Array> = [];
                fileStrm.on("data", chunk => chunks.push(chunk));

                // save chunks and info into files object
                fileStrm.on("close", () => {
                    files[name] = {
                        buffer: Buffer.concat(chunks),
                        filename: info.filename,
                        mimetype: info.mimeType,
                        encoding: info.encoding,
                    };
                });
            });

            // when too many files
            bb.on("filesLimit", () => {
                return throwError(new InvalidRequestError("Files limit exceeded"));
            });

            // when too many fields
            bb.on("fieldsLimit", () => {
                return throwError(new InvalidRequestError("Fields limit exceeded"));
            });

            // when finished processing
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

// optional default export
export default {
    textOnly,
    files,
};
