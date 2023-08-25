import {getCookie} from "../lib/cookie.ts";
import {request} from "./requests.ts";
import {Is} from "../lib/types.ts";

/**
 * Gets user token from cookies
 */
export function getUserToken(): string | null {
    return getCookie("user") || null;
}


export function getUser(): VGMuse.Frontend.User | null {
    const token = getUserToken();
    if (!token) return null;

    const userJson = atob(token.split(".")[1]);
    const user = JSON.parse(userJson);

    if (!Is.userContainer(user))
        return null;

    return user.user;
}

// Refresh the current logged-in user
export async function refreshUser() {
    return await request("/api/auth/refresh");
}


export async function resetPassword(token: string) {
    return await request("/api/auth/reset-password/", "POST", {token});
}

export async function resendVerificationEmail() {
    return await request("/api/auth/resend-verification", "POST");

}

export async function activateUser(token: string) {
    return await request("/api/auth/activate/" + token.trim());
}

export async function logout() {
    return await request("/api/auth/logout", "POST");
}
