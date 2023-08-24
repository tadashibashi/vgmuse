import {readUserToken} from "../lib/user/token";

/**
 * This middleware function gets the user from the browser cookie
 * And injects it into req.user. Null value if user is not logged in.
 */
export default function injectUser() {
    return async function (req, res, next) {
        try {
            req.user = (await readUserToken(req, res))?.user;
            if (req.user) {
                req.user.isAdmin = req.user.userType === "admin";
                req.user.isStaff = req.user.userType === "staff" || req.user.userType === "admin";
            }

            next();
        } catch (err) {
            next(err);
        }

    } as VGMuse.MiddlewareFunction;
}
