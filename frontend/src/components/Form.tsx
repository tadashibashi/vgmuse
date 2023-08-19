import {FormEvent, PropsWithChildren} from "react";
import {HttpMethod, sendForm} from "../api/requests.ts";

interface Props extends PropsWithChildren {
    /**
     * Called before the form data is submitted.
     * Returning false will result in cancelling the submission,
     * truthy will allow it to submit
     * @param e - the form event, it has already been default-prevented so no need
     *            to call that here.
     */
    shouldSubmit?: (e: FormEvent) => number;
    onResponse?: (data: unknown) => void;
    catchError?: (err: unknown) => void;
    className?: string;
    action: string;

    /**
     * Http method, default: POST
     */
    method?: HttpMethod;
}


export default function Form({action, method, shouldSubmit, onResponse, catchError, children, className}: Props) {

    async function _handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Check if form should submit
        if (shouldSubmit && !shouldSubmit(e))
            return;

        // send form, make callbacks
        let res: unknown;
        try {
            res = await sendForm(action, method || "POST", new FormData(e.currentTarget));
            if (onResponse)
                onResponse(res);
        } catch(err) {
            if (catchError)
                catchError(err);
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