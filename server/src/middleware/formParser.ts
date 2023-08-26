import busboy, {FileInfo} from "busboy";
import {UploadFile} from "../api/s3";
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

function cleanUpFiles(files: Record<string, VGMuse.FileData>) {
    for (const fileData of Object.values(files))
        fileData.file.resume();
}


export const files = function(opts?: FilesOpts) {
    return function(req, res, next) {
        const files: Record<string, VGMuse.FileData> = {};
        const body: Record<string, string | busboy.Info> = {};

        try {
            const bb = busboy({headers: req.headers, limits: opts?.limits});

            bb.on("field", (name, value) => {
                body[name] = value;
            });

            bb.on("file", (name, stream, info) => {
                files[name] = {
                    file: stream,
                    filename: info.filename,
                    mimetype: info.mimeType,
                    encoding: info.encoding,
                };
            });

            bb.on("filesLimit", () => {
                cleanUpFiles(files);
                next(new InvalidRequestError("Files limit exceeded"));
            });

            bb.on("fieldsLimit", () => {
                cleanUpFiles(files);
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
            cleanUpFiles(files);
            next(err);
        }

    } as VGMuse.MiddlewareFunction;
}

export default {
    textOnly,
};
