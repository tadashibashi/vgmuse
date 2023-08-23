import {getCookie} from "../lib/cookie.ts";
import {request} from "./requests.ts";
import {Is} from "../lib/types.ts";

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

// Get the current logged-in user
export async function getBackendUser() {
    const user = await request("/api/auth/user");
    console.log(user);
    return user;
}



export async function resetPassword(token: string) {
    const result = await request("/api/auth/reset-password/", "POST", {token});
    if (Is.errorContainer(result)) {

    }
}