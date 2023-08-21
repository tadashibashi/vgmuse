import configEnv from "../config/env";
configEnv();

/**
 * Get an environment variable, if it doesn't exist, return undefined.
 * @param key - environment variable name
 */
export function getEnv(key: string): string | undefined {
    return process.env[key];
}

/**
 * Require an environment variable, throwing a ReferenceError if
 * it does not exist.
 * @param key - environment variable name
 */
export function reqEnv(key: string): string {
    const val = process.env[key];
    if (val === undefined)
        throw ReferenceError("Missing required var in environment: " + key);
    return val;
}
