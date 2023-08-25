import urls from "../../urls";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {activateUser, resendVerificationEmail} from "../../api/auth.ts";
import Alert from "../../components/Alert.tsx";
import {Is} from "../../lib/types.ts";
import {useQuery} from "../../hooks/useQuery.ts";



function useDebounce<Args extends any[], Ret extends any>(fn: (...args: Args) => Ret, ms: number) {
    const debouncedRef = useRef(() => {});

    return debouncedRef.current;
}

export default function ValidationReceivedPage() {
    const query = useQuery();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        async function sendValidation() {

            if (query.get("token"))
                return activateUser(query.get("token")!);
            else
                setError("Missing token");
        }

        sendValidation()
            .catch(err => {
                console.log(err);
                setLoaded(true);
                setError(err);
            })
            .then(payload => {
                setLoaded(true);
            });
    }, []);

    function isError(err: any): err is {message: string} {
        return (err && err.message === "string");
    }

    const debouncedResend = useDebounce(handleResend, 20000); // once every 20 seconds

    async function handleResend(evt: React.MouseEvent) {
        const result = await resendVerificationEmail();

        if (Is.errorContainer(result)) {
            console.error(result.error);
        }
    }

    return (
        <>
            <h2 className="my-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 pointer-events-none">
                Account Activation
            </h2>
            {
                loaded &&
                (error ? (
                    <>
                        <Alert type="error" title="We're sorry, a problem occurred during activation">
                            <p>{isError(error) && error.message}</p>
                        </Alert>
                        <p className="text-center mt-10 text-sm text-gray-600">
                            <span className="pointer-events-none">Click </span>
                            <a onClick={debouncedResend} className="underline text-gray-400 active:text-gray-500 pointer-events cursor-pointer">here</a>
                            <span className="pointer-events-none"> to resend activation email</span>
                        </p>
                    </>
                ) : (
                    <>
                        <Alert type="confirm" title="Success">
                            <p>Your account has been activated</p>
                        </Alert>
                    </>
                ))
            }
        </>

    );
}
