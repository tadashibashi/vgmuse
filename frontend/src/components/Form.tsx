import {FormEvent, PropsWithChildren} from "react";
import {HttpMethod, sendForm} from "../api/requests.ts";
import {FormErrors, hasFormErrors} from "../utility/formValidation.ts";

interface Props extends PropsWithChildren {
    /**
     * Called before the form data is submitted.
     * Returning false will result in cancelling the submission,
     * truthy will allow it to submit
     * @param data - the form event, it has already been default-prevented so no need
     *            to call that here.
     */
    shouldSubmit?: (data: FormData) => boolean;
    onSuccess?: (data: unknown) => void;
    onValidationError?: (errors: FormErrors) => void;
    catchException?: (err: unknown) => void;
    className?: string;
    action: string;

    /**
     * Http method, default: POST
     */
    method?: HttpMethod;
}


export default function Form({action, method, shouldSubmit, onSuccess, onValidationError, catchException, children, className}: Props) {

    async function _handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.nativeEvent.target as HTMLFormElement)

        // Check if form should submit
        if (shouldSubmit && !shouldSubmit(formData))
            return;

        // send form, make callbacks
        let res: unknown;
        try {
            res = await sendForm(action, method || "POST", formData);
            if (hasFormErrors(res)) {
                if (onValidationError)
                    onValidationError(res.errors);
            } else {
                if (onSuccess)
                    onSuccess(res);
            }

        } catch(err) {
            if (catchException)
                catchException(err);
            else
                throw err;
        }
    }

    return (
        <form className={className} onSubmit={_handleSubmit}>
            {children}
        </form>
    );
}