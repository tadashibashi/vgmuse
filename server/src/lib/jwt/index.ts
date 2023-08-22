import jwt, {decode, JwtPayload} from "jsonwebtoken";
import {reqEnv} from "../env";
import {ALGORITHM} from "./constants";

const JWT_SECRET = reqEnv("JWT_SECRET");

/**
 * Create a new JSON webtoken
 * @param payload - the data to store, gets JSON-stringified
 * @param expiresIn - vercel ms notation for time, default: 24h -
 *                    for more info: https://github.com/vercel/ms
 */
export function createToken<T extends (object|Buffer) & {error?: unknown}>(payload: T, expiresIn: number|string="24h"): string {
    if (payload["error"])
        throw Error("createToken: fieldName 'error' is reserved for server-side error handling, please remove from payload");
    return jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: expiresIn, algorithm: ALGORITHM},
    );
}

/**
 * Check for token verification and decode it
 * @param token - JWT token string
 * @param allowExpired - allows expired tokens to pass verification - default: false
 *                       if set to true, pass payload in isTokenExpired to check this
 * @returns unknown decoded payload, or {error: jwt.TokenExpiredError | jwt.JsonWebTokenError}
 * Check for `!returnedPayload.error` to check if valid
 * Error docs, for convenience:
 * ```
 * TokenExpiredError
 * name: 'TokenExpiredError'
 * message: 'jwt expired'
 * expiredAt: [ExpDate]
 *
 * JsonWebTokenError
 * name: 'JsonWebTokenError'
 * message:
 * 'invalid token' - the header or payload could not be parsed
 * 'jwt malformed' - the token does not have three components (delimited by a .)
 * 'jwt signature is required'
 * 'invalid signature'
 * 'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
 * 'jwt issuer invalid. expected: [OPTIONS ISSUER]'
 * 'jwt id invalid. expected: [OPTIONS JWT ID]'
 * 'jwt subject invalid. expected: [OPTIONS SUBJECT]'
 * ```
 */
export function verifyToken(token: string, allowExpired: boolean = false) {
    function isPayload(arg: unknown): arg is JwtPayload & {error: undefined} {
        return typeof arg === "object";
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET, {algorithms: [ALGORITHM], ignoreExpiration: allowExpired});
        if (isPayload(payload))
            return payload;
        else
            throw new Error("Payload was unexpectedly a string");
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError ||
            e instanceof jwt.JsonWebTokenError)
            return {error: e};
        throw e;
    }
}


/**
 * Check whether a payload is expired
 * @param payload - payload to check
 */
export function isPayloadExpired(payload: JwtPayload) {
    return payload.exp && payload.exp <= Date.now()/1000.0;
}
