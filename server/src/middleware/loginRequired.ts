import {ForbiddenError, UnauthorizedError} from "../lib/errors";

// Note: use strings not ts-enum, since they may change meaning of values where DB must be persistent
const levels: Record<VGMuse.UserType, number> = {"user": 0, "staff": 1, "admin": 2};

export function loginRequired(accessLevel: VGMuse.UserType = "user") {

    return function(req, res, next) {

        const user = req.user;
        if (!user)
            return next(new UnauthorizedError()); // 401

        if (levels[accessLevel] > levels[user.userType])
            return next(new ForbiddenError());    // 403

        // user authorized
        next();

    } as VGMuse.MiddlewareFunction;

}