import jwt from "jsonwebtoken";

export interface IRefreshToken extends jwt.JwtPayload {
    user: string;
}

export namespace Is {
    export function userRefreshToken(payload: jwt.JwtPayload): payload is IRefreshToken {
        return typeof payload.user === "string";
    }
}
