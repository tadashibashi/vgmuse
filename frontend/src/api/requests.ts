import {APIError} from "../utility/errors.ts";

type HttpMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Make a request and receive data
 * @param url     - url to send to
 * @param method  - request method e.g. "GET", "PUT", "POST", "DELETE"
 * @param payload - object to send in the body
 * @param receive - type of object to receive
 */
export async function request<T=unknown>(url: string, method: HttpMethodType, payload?: unknown, receive?: "json"): Promise<T>;
export async function request(url: string, method: HttpMethodType, payload: unknown, receive?: "buffer"): Promise<ArrayBuffer>;
export async function request(url: string, method: HttpMethodType="GET", payload?: unknown,
                              receive: "json" | "buffer"="json"): Promise<unknown | ArrayBuffer> {

    const options: RequestInit = {
        method: method,
        body: payload ? JSON.stringify(payload) : null,
        headers: {"Content-Type": "application/json"},
    };

    const res = await fetch(url, options);
    if (!res.ok)
        throw new APIError(res.status, res.statusText);

    return receive === "json" ? res.json() : res.arrayBuffer();
}

/**
 * Send form data to an endpoint
 * @param url    - url to send form to
 * @param method - http method to use
 * @param formEl - html form element containing input data
 *                 e.g. in onSubmit, pass the event target here
 */
export async function sendForm(url: string, method: HttpMethodType, formEl: HTMLFormElement): Promise<unknown> {
    const options: RequestInit = {
        method: method,
        body: new FormData(formEl),
    };

    const res = await fetch(url, options);
    if (!res.ok)
        // in express `statusText` is set via res.nativeResponse.statusMessage
        throw new APIError(res.status, res.statusText);

    return res.json();
}
