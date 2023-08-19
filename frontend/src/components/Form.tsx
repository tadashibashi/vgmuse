import {FormEvent, PropsWithChildren} from "react";
import {HttpMethod, sendForm} from "../api/requests.ts";

interface Props extends PropsWithChildren {
    onSubmit?: (e: FormEvent) => void;
    className?: string;
    url: string;
    method?: HttpMethod;
}

export default function Form({url, method, onSubmit, children, className}: Props) {

    function _handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (onSubmit)
            onSubmit(e);

        sendForm(url, method || "POST", new FormData(e.currentTarget))
            .catch(err => console.error("Error while submitting form:", err));
    }

    return (
        <form className={className} onSubmit={_handleSubmit}>
            {children}
        </form>
    );
}