import jwt from "jsonwebtoken";

export interface IRefreshToken extends jwt.JwtPayload {
    user: string;
}

export interface IActivationToken extends jwt.JwtPayload {
    user: string;
}

export namespace Is {
    export function userRefreshToken(payload: jwt.JwtPayload): payload is IRefreshToken {
        return typeof payload.user === "string";
    }

    export function userActivationToken(payload: jwt.JwtPayload): payload is IActivationToken {
        return typeof payload.user === "string";
    }
}
