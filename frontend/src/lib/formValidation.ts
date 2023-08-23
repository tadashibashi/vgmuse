import {IError} from "./types.ts";
export type FormErrors = Record<string, IError>;


/**
 * Duck-type for form errors in response
 * @param data
 */
export function hasFormErrors(data: any): data is {errors: FormErrors} {
    if (!(data && typeof data === "object" && data.errors && typeof data.errors === "object"))
        return false;

    for (const err of Object.values(data))
        if (typeof err !== "object" || typeof (err as any).message !== "string" ||
            typeof (err as any).name !== "string")
            return false;

    return true;
}
