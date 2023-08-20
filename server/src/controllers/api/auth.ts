import User from "../../models/User";
import {Error} from "mongoose";

export const login = function(req, res, next) {



} as VGMuse.MiddlewareFunction;

export const logout = function(req, res, next) {



} as VGMuse.MiddlewareFunction;


export const signup = async function(req, res, next) {
    try {
        const user = new User(req.body);
        await user.validate();
        await res.json(user);

    } catch(err) {
        if (err instanceof Error.ValidationError)
            res.json({errors: err.errors});
        else
            next(err);
    }

} as VGMuse.MiddlewareFunction;
