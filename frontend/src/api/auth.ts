import {getCookie} from "../utility/cookie.ts";
import {request} from "./requests.ts";

/**
 * Gets user token from cookies
 */
export function getUserToken(): string | null {
    return getCookie("user") || null;
}

export function getUser(): string | null {
    const token = getUserToken();
    if (!token) return null;

    return atob(token.split(".")[1]);
}

export async function getBackendUser() {
    const user = await request("/api/auth/user");
    console.log(user);
    return user;
}