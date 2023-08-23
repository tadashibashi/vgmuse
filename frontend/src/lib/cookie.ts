
export function getCookie(key: string) {
    return document.cookie
        .split(/;\s*/)
        .find(cookie => cookie.startsWith(key + "="))
        ?.split("=")[1];
}
