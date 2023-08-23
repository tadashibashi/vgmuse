import User from "../../models/User";
import {Error} from "mongoose";
import {sendEmail} from "../../api/email";
import {reqEnv} from "../../lib/env";
import {createToken, verifyToken} from "../../lib/jwt";
import {passUserToken, readUserToken} from "../../lib/userToken";
import {InvalidRequestError, UnimplementedError} from "../../lib/errors";
import jwt from "jsonwebtoken";
import {Is} from "../../lib/types";



export const refreshUser = async function(req, res, next) {

    try {
        const user = await readUserToken(req, res);
        return res.json(user);
    } catch (e) {
        next(e);
    }

} as VGMuse.MiddlewareFunction;

// POST /api/auth/reset-password/:token
export const resetPassword = async function(req, res, next) {

    const token = req.params["token"];
    if (!token)
        return next(new InvalidRequestError());

    new UnimplementedError("resetPassword auth controller");
    verifyToken(token);

} as VGMuse.MiddlewareFunction;



// POST /api/auth/activate/:token
export const activateAccount = async function(req, res, next) {

    const token = req.params["token"];
    if (!token)
        return next(new InvalidRequestError());

    try {
        const payload = verifyToken(token);

        if (!Is.userActivationToken(payload)) {
            return next(new InvalidRequestError());
        }

        const user = await User.findById(payload.user);
        if (!user) {
            return next(new InvalidRequestError());
        }

        if (user.isValidated) {
            return next(new InvalidRequestError("Your account has already been validated"))
        }

        user.isValidated = true;
        await user.save();

        return res.json({result: "success"});

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return next(new InvalidRequestError("Your link contained an invalid token"));
        } else if (e instanceof jwt.TokenExpiredError) {
            return next(new InvalidRequestError("Your link has expired"));
        } else {
            return next(e);
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
        res.clearCookie("user");
        res.clearCookie("user-refresh")
        return res.json({success: "true"});
    } catch (e) {
        return next(e);
    }

} as VGMuse.MiddlewareFunction;



export const signup = async function(req, res, next) {
    try {
        const user = new User(req.body);
        await user.validate();
        await user.save();

        // User is not validated yet, create activation token and send email
        const token = createToken({user: user._id}, "15m");

        // send email
        sendEmail(user.email, reqEnv("EMAIL_SENDER"), "Activate your VGMuse Account",

`<p>Hello,</p>
<p>Thank you for registering your account at VGMuse! 
Please click the link below to activate your account.<p>

<a href="http://localhost:3000/api/auth/activate/${token}">http://localhost:3000/api/auth/activate/${token}</a>

<p>We hope you enjoy your new chiptune music space!</p>

<p>Best regards,</p>
<p>The VGMuse Team</p>
`).catch(err => { console.error(err); });

        // pass token to frontend
        return res.json(user);

    } catch(err) {
        if (err instanceof Error.ValidationError)
            return res.json({errors: err.errors});
        else
            return next(err);
    }

} as VGMuse.MiddlewareFunction;
