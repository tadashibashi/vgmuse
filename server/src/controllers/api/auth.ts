import User from "../../models/User";
import {Error} from "mongoose";
import {sendEmail} from "../../api/email";
import {reqEnv} from "../../lib/env";
import {createToken} from "../../lib/jwt";
import {passUserToken, readUserToken} from "../../lib/userToken";

export const getUser = async function(req, res, next) {

    try {
        const user = readUserToken(req);
        return res.json(user);
    } catch (e) {
        next(e);
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
                "username": {
                    "name": "DatabaseReferenceError",
                    "message": "A user with that username was not found",
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

`<p>Dear ${user.username},</p>
<p>Thank you for registering your account at VGMuse.com! 
Please click the link below to activate your account.<p>

<a href="https://localhost:3000/api/auth/activate/${token}">https://localhost:3000/api/auth/activate/${token}</a>

<p>We hope you enjoy your new chiptune music space!</p>

<p>Best regards,</p>
<p>Aaron from VGMuse</p>
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
