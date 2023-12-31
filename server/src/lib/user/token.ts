import {Response, Request} from "express";
import {JwtPayload} from "jsonwebtoken";
import {createToken, isPayloadExpired, verifyToken} from "../jwt";
import {DOMAIN, PRODUCTION} from "../jwt/constants";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {User} from "../../models";

const ONE_YEAR =  31_556_952_000;
const ONE_MONTH =  2_592_000_000;
const ONE_DAY =       86_400_000;
const FIFTEEN_MINS = 900_000;


const SALT_ROUNDS = 8;

const domain = DOMAIN === "localhost" ? undefined : DOMAIN;

function createCookie(name: string, val: string, maxAge: number|undefined, httpOnly: boolean, res: Response) {
    if (domain) {
        res.cookie(name, val, {
            httpOnly,
            maxAge,
            sameSite: "strict",
            secure: PRODUCTION,
            domain: domain,
        });
    } else {
        res.cookie(name, val, {
            httpOnly,
            maxAge,
            sameSite: "strict",
            secure: PRODUCTION,
        });
    }
}

// passes user token to the frontend cookie
export function passUserToken(user: VGMuse.Frontend.User | VGMuse.IUser, rememberMe: boolean, req: Request, res: Response) {
    // fingerprint to check if user token is valid
    let fingerprint = crypto.randomBytes(32).toString("hex");

    if (!rememberMe)
        res.clearCookie("user-refresh");

    createCookie("fingerprint", fingerprint, ONE_MONTH, true, res);

    if (!req.cookies["user-refresh"]) {
        // create the refresh token if it doesn't exist and rememberMe was checked
        const refreshToken = createToken({user: user._id}, "30d");
        createCookie("user-refresh", refreshToken, rememberMe ? ONE_MONTH : undefined, true, res);
    }

    const userToSend = {
        _id: user._id,
        username: user.username,
        userType: user.userType,
        email: user.email,
        fingerprint: bcrypt.hashSync(fingerprint, SALT_ROUNDS)
    };

    const token = createToken( {user: userToSend}, "15m");
    createCookie("user", token, rememberMe ? ONE_DAY : undefined, false, res);

    return token;
}

const AUTH_TYPE = "Bearer ";


// reads user cookie from authorization header
export async function readUserToken(req: Request, res: Response): Promise<(JwtPayload & {user?: VGMuse.Frontend.User}) | null> {

    // get auth token
    let token = req.headers.authorization || null;


    // verify that token is Bearer auth type
    if (token) {
        if (token.startsWith(AUTH_TYPE))
            // remove "Bearer "
            token = token.slice(AUTH_TYPE.length);
        else
            return cleanUp();
    }

    const refresh = req.cookies["user-refresh"];
    if (!token) {
        if (refresh) {
            token = await refreshToken(refresh);
            if (!token) {
                return cleanUp();
            }
        } else {
            return cleanUp();
        }
    }

    // check that token valid and parse it
    const payload = verifyToken(token, true);

    if (payload.error) {
        return cleanUp();
    }

    // check that payload has user
    if (!isJwtPayload(payload) || !isUserPayload(payload)) {
        return cleanUp();
    }

    // check if expired payload
    const expired = isPayloadExpired(payload);
    if (expired) {
        // check for refresh token
        if (refresh) {
            token = await refreshToken(refresh, payload.user);
            if (!token) {
                return cleanUp();
            }
        } else {
            return cleanUp();
        }
    }

    // check that fingerprints match
    let fingerprint = req.cookies["fingerprint"];
    if (!fingerprint) {
        return cleanUp();
    }

    try {
        if (!bcrypt.compareSync(fingerprint, payload.user.fingerprint || "")) {
            console.error("fingerprint does not match!");
            // delete invalid token
            return cleanUp();
        }
    } catch(err) {
        return cleanUp();
    }

    return payload;

    // ----- Helpers -----

    function isJwtPayload(token: any): token is JwtPayload {
        return (token.error === undefined)
    }
    function isUserPayload(payload: JwtPayload): payload is JwtPayload & {user: VGMuse.Frontend.User} {
        return !!payload.user && typeof payload.user === "object";
    }
    function isRefreshPayload(payload: JwtPayload): payload is JwtPayload & {user: string} {
        return !!payload.user && typeof payload.user === "string";
    }

    async function refreshToken(token: string, user?: VGMuse.Frontend.User) {
        const refreshToken = verifyToken(token);

        // check for valid refresh token
        if (!refresh || refreshToken.error || !isRefreshPayload(refreshToken)) {
            return null;
        }

        // no user, get it from the db
        if (!user) {
            user = await User.findById(refreshToken.user) || undefined;

            if (!user) {
                return null;
            }
        }

        return passUserToken(user, true, req, res);

    }

    function cleanUp() {
        res.clearCookie("user");
        res.clearCookie("user-refresh");
        return null;
    }
}