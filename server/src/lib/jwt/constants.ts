import {getEnv, reqEnv} from "../env";
import jwt from "jsonwebtoken";

function getAlgorithm() {
    const algorithm = reqEnv("JWT_ALGO");

    if (!isAlgorithm(algorithm))
        throw Error("JWT_ALGO must be a valid algorithm!");
    return algorithm;
}


function isAlgorithm(str: string): str is jwt.Algorithm {
    switch(str) {
        case "HS256": case "HS384": case "HS512":
        case "RS256":  case "RS384":  case "RS512":
        case "ES256":  case "ES384":  case "ES512":
        case "PS256":  case "PS384":  case "PS512":
            // case "none": // remove "none" since we want an algorithm
            return true;
        default:
            return false;
    }
}


export const PRODUCTION = getEnv("PRODUCTION") === "true";
export const DOMAIN = reqEnv("DOMAIN") || "localhost";

export const ALGORITHM = getAlgorithm();
