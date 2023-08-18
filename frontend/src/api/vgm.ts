import {request, sendForm} from "./requests.ts";

const BASE_URL = "/api/vgm";

/**
 * Get a logged in user's vgm
 */
export async function getAll() {
    return request(BASE_URL);
}

export async function getOne(id: string) {
    return request(`${BASE_URL}/${id}`);
}

export async function createOne(formData: FormData) {
    return sendForm(BASE_URL, "POST", formData);
}

export async function updateOne(id: string, formData: FormData) {
    return sendForm(BASE_URL, "PATCH", formData);
}

export async function deleteOne(id: string) {
    return request(`${BASE_URL}/${id}`, "DELETE");
}
