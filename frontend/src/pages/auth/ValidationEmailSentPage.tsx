import urls from "../../urls";
import {Link} from "react-router-dom";

import {EnvelopeIcon} from "@heroicons/react/24/outline";
import React, {useRef} from "react";
import debounce from "../../lib/debounce.ts";
import {getUser, resendVerificationEmail} from "../../api/auth.ts";
import {Is} from "../../lib/types.ts";


export default function ValidationEmailSentPage() {

    const debouncedResend = useRef(debounce(handleResend, 20000)); // once every 20 seconds

    async function handleResend(evt: React.MouseEvent) {
        const result = await resendVerificationEmail();

        if (Is.errorContainer(result)) {
            console.error(result.error);
        }
    }

    return (
        <>
            <EnvelopeIcon className="mx-auto animate-pulse -mb-2 mt-16 drop-shadow-sm" width="40"/>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm select-none">
                <p className="text-center mb-2 pointer-events-none">A verification email was just sent to your address.</p>
                <p className="text-center pointer-events-none">Please click the activation link inside to complete your registration.</p>

                <p className="text-center mt-10 text-sm text-gray-600">
                    <span className="pointer-events-none">Not showing up? Click </span>
                    <a onClick={debouncedResend.current} className="underline text-gray-400 active:text-gray-500 pointer-events cursor-pointer">here</a>
                    <span className="pointer-events-none"> to resend</span>
                </p>
            </div>
        </>
    );
}
