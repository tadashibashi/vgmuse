import {ServerError} from "../utility/errors.ts";
import {getUserToken} from "./auth.ts";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Make a request and receive js object data.
 * Throws APIError if any problem occurred.
 * @param url     - url to send to
 * @param method  - request method e.g. "GET", "PUT", "POST", "DELETE", default: "GET"
 * @param payload - object to send in the body
 */
export async function request(url: string, method: HttpMethod="GET", payload?: unknown): Promise<unknown> {
    const res = await _request(url, method, payload);
    return res.json();
}


/**
 * Inject user token authorization into header if there is a token stored locally
 * @param options
 */
function injectUserHeader(options: RequestInit & {headers?: {Authorization?: string}}) {
    const userToken = getUserToken();
    if (!userToken) return;

    if (!options.headers)
        options.headers = {};

    options.headers.Authorization = "Bearer " + getUserToken();
}


/**
 * Private request base function
 * @param url - url to send request to
 * @param method - method to send
 * @param payload - js object payload, if any
 */
async function _request(url: string, method: HttpMethod, payload?: unknown) {
    const options: RequestInit = {
        method: method,
        body: payload ? JSON.stringify(payload) : null,
        headers: {"Content-Type": "application/json"},
    };

    injectUserHeader(options);

    // make request
    const res = await fetch(url, options);
    if (!res.ok)
        throw new ServerError(res.status, res.statusText);
    return res;
}


/**
 * Send form data to an endpoint
 * @param url    - url to send form to
 * @param method - http method to use
 * @param formData - html form element containing input data
 *                 e.g. in onSubmit, pass the event target here
 */
export async function sendForm(url: string, method: HttpMethod, formData: FormData): Promise<unknown> {
    const options: RequestInit = {
        method: method,
        body: formData,
    };

    injectUserHeader(options);

    const res = await fetch(url, options);
    if (!res.ok)
        // in express `statusText` is set via res.nativeResponse.statusMessage
        throw new ServerError(res.status, res.statusText);

    return res.json();
}


/**
 * Load a file and return an arrayBuffer on success.
 * Throws a ServerError if any error occurred.
 * Source address file must allow CORS policy from our base website url.
 * @param url
 */
export async function fetchFile(url: string) {
    const res = await _request(url, "GET", null);
    return res.arrayBuffer();
}
