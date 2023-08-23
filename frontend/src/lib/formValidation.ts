export interface FormErrors {
    [key: string]: {name: string, message: string};
}


/**
 * Duck-type for form errors in response
 * @param data
 */
export function hasFormErrors(data: any): data is {errors: FormErrors} {
    return "errors" in data;
}
