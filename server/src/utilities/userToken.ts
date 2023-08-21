import {Response, Request} from "express";
import {JwtPayload} from "jsonwebtoken";
import {createToken, verifyToken} from "./jwt";
import {DOMAIN, PRODUCTION} from "./jwt/constants";


const ONE_YEAR =  31_556_952_000;
const ONE_MONTH =  2_592_000_000;
const ONE_DAY =       86_400_000;


// passes user token to the frontend cookie
export function passUserToken(user: VGMuse.IUser, rememberMe: boolean, req: Request, res: Response) {
    const token = createToken( {user}, rememberMe ? "30d" : "24h");

    res.cookie("user", token, {
        maxAge: rememberMe ? ONE_MONTH : null,
        sameSite: "strict",
        secure: PRODUCTION,
        domain: PRODUCTION ? DOMAIN : "http://localhost",
    });
}



// reads user cookie from the frontend
export function readUserToken(req: Request): (JwtPayload & {user?: VGMuse.Frontend.User}) | null {
    function isJwtPayload(token: any): token is JwtPayload {
        return (token.error === undefined)
    }

    function hasUser(payload: JwtPayload): payload is JwtPayload & {user: VGMuse.Frontend.User} {
        return !!payload.user;
    }

    const cookie = req.cookies["user"];
    if (!cookie) return null;

    const token = verifyToken(cookie);
    if (!isJwtPayload(token) || !hasUser(token))
        return null;

    return token;
}