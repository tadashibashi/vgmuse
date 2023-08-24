import {IError} from "./types.ts";
export type FormErrors = Record<string, IError>;


/**
 * Duck-type for form errors in response
 * @param data
 */
export function hasFormErrors(data: any): data is {errors: FormErrors} {
    return data && typeof data === "object" && data.errors && typeof data.errors === "object";
}
