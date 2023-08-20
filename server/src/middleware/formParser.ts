import busboy from "busboy";

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

export default {
    textOnly,
};
