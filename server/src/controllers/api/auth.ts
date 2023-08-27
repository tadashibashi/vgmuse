import User from "../../models/User";
import {Error} from "mongoose";

import {verifyToken} from "../../lib/jwt";
import {passUserToken, readUserToken} from "../../lib/user/token";
import {InvalidRequestError, UnimplementedError} from "../../lib/errors";
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {Is} from "../../lib/types";
import {hashCompare} from "../../lib/hash";
import {sendVerificationEmail} from "../../lib/user/verification";
import {DOMAIN} from "../../constants";
import {PRODUCTION} from "../../lib/jwt/constants";




export const refreshUser = async function(req, res, next) {

    try {
        const user = await readUserToken(req, res);
        return res.json(user);
    } catch (e) {
        next(e);
    }

} as VGMuse.MiddlewareFunction;


/**
 * resetPassword
 * Route: POST /api/auth/reset-password/:token
 *
 * Need to create routing to this controller
 */
export const resetPassword = async function(req, res, next) {

    const token = req.params["token"];
    if (!token)
        return next(new InvalidRequestError("Missing \"token\" parameter"));

    try {
        const payload = verifyToken(token);

        if (!Is.userActivationToken(payload)) {
            return res.json(new InvalidRequestError("Invalid token"));
        }

    } catch (err) {
        if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError)
            return res.json(err);
    }






} as VGMuse.MiddlewareFunction;



/**
 * activateAccount
 * POST /api/auth/activate/:token
 */
export const activateAccount = async function(req, res, next) {

    const token = req.params["token"];
    if (!token)
        return res.json(new InvalidRequestError("Parameter \"token\" was missing from request"));
    try {
        const payload = verifyToken(token);
        if (payload.error) {
            if (payload.error.name === "TokenExpiredError")
                return res.json(new InvalidRequestError("Activation link expired"));
            else
                return res.json(new InvalidRequestError("Invalid token"));
        }

        if (!Is.userActivationToken(payload)) {
            return res.json(new InvalidRequestError());
        }

        const user = await User.findOne({username: payload.user.name});
        if (!user) {
            return res.json(new InvalidRequestError("User does not exist"));
        }

        if (user.isValidated) {
            return res.json(new InvalidRequestError("Your account has already been validated"))
        }

        if (!await hashCompare(user._id.toString(), payload.user.id))
            return res.json(new InvalidRequestError("User identification error"));

        user.isValidated = true;
        await user.save();

        return res.json({result: "success"});

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.json(new InvalidRequestError("Your link contained an invalid token"));
        } else if (e instanceof jwt.TokenExpiredError) {
            return res.json(new InvalidRequestError("Your link has expired"));
        } else {
            return res.json(e);
        }
    }

} as VGMuse.MiddlewareFunction;



export const login = async function(req, res, next) {
    const email = req.body["email"];
    const password = req.body["password"];
    const rememberMe = req.body["remember-me"];

    const user = await User.findOne({email: email});
    if (!user) {
        return res.json({
            errors: {
                "email": {
                    "name": "DatabaseReferenceError",
                    "message": "An an account with that email address was not found",
                }
            }
        });
    }

    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
        return res.json(
            {
                errors: {
                    "password": {
                        "name": "PasswordMismatchError",
                        "message": "Password was incorrect"
                    }
                }
            });
    }

    passUserToken(user, rememberMe, req, res);
    return res.json(user);

} as VGMuse.MiddlewareFunction;



export const logout = function(req, res, next) {
    try {
        res.clearCookie("user", {domain: DOMAIN, sameSite: "strict", secure: PRODUCTION});
        res.clearCookie("user-refresh", {domain: DOMAIN, sameSite: "strict", secure: PRODUCTION, httpOnly: true});
        res.clearCookie("fingerprint", {domain: DOMAIN, sameSite: "strict", secure: PRODUCTION, httpOnly: true});

        return res.json({success: "true"});
    } catch (e) {
        return next(e);
    }

} as VGMuse.MiddlewareFunction;


export const resendVerificationEmail = async function(req, res, next) {
    if (req.user) {
        if (req.user.isValidated)
            return next(new InvalidRequestError("User is already validated"));
        try {
            await sendVerificationEmail(req.user);
        } catch(err) {
            next(err);
        }

        return res.json({result: "success"});

    } else {
        next(new InvalidRequestError());
    }

} as VGMuse.MiddlewareFunction;


export const signup = async function(req, res, next) {
    try {
        const user = new User(req.body);
        await user.validate();
        await user.save();

        passUserToken(user, false, req, res);

        await sendVerificationEmail(user);
        return res.json(user);

    } catch(err) {
        if (err instanceof Error.ValidationError)
            return res.json({errors: err.errors});
        else
            return next(err);
    }


} as VGMuse.MiddlewareFunction;
