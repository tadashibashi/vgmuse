import {readUserToken} from "../lib/userToken";

/**
 * This middleware function gets the user from the browser cookie
 * And injects it into req.user. Null value if user is not logged in.
 */
export default function injectUser() {
    return function (req, res, next) {
        try {
            req.user = readUserToken(req)?.user;
            next();
        } catch (err) {
            next(err);
        }

    } as VGMuse.MiddlewareFunction;
}
