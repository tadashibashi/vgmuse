import urls from "../../urls";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {activateUser, getUser, resendVerificationEmail} from "../../api/auth.ts";
import Alert from "../../components/Alert.tsx";
import {Is} from "../../lib/types.ts";
import {useQuery} from "../../hooks/useQuery.ts";
import {Link} from "react-router-dom";
import ButtonPrimary from "../../components/buttons/ButtonPrimary.tsx";
import {ArrowRightIcon} from "@heroicons/react/24/outline";
import ButtonCancel from "../../components/buttons/ButtonCancel.tsx";
import {queryCtx} from "./AuthPages.tsx";



function useDebounce<Args extends any[], Ret extends any>(fn: (...args: Args) => Ret, ms: number) {
    const debouncedRef = useRef(() => {});

    return debouncedRef.current;
}

export default function ValidationReceivedPage() {

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [user, setUser] = useState(() => getUser());

    const query = useContext(queryCtx);

    useEffect(() => {
        async function sendValidation() {
            if (query.get("token"))
                return activateUser(query.get("token")!);
            else
                setError({name: "", message: "There was no token – please make sure to visit the link in your activation email."});
        }

        sendValidation()
            .catch(err => {
                console.log(err);
                setLoaded(true);
                setError(err);
            })
            .then(payload => {
                setLoaded(true);
                console.log(payload);
            });
    }, []);

    function isError(err: any): err is {message: string} {
        return (err && typeof err.message === "string");
    }

    const debouncedResend = useDebounce(handleResend, 15000); // once every 20 seconds

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
                (user && user.isValidated) ?
                    <>
                        <Alert type="info" title="Thanks for checking in">
                            <p>Your account is already activated</p>
                        </Alert>
                        <div className="flex justify-center items-center mt-4">
                            <Link to={urls.root.app.path}><ButtonCancel>Back to App <ArrowRightIcon className="relative top-1 left-1 w-4"/></ButtonCancel></Link>
                        </div>
                    </>
:
                (error ? (
                    <>
                        <Alert type="error" title="We're sorry, a problem occurred:">
                            <p className="text-sm">{isError(error) && error.message}</p>
                        </Alert>
                        {user ?
                            <p className="text-center mt-10 text-sm text-gray-600">
                                <span className="pointer-events-none">Click </span>

                                        <a onClick={debouncedResend} className="underline text-gray-400 active:text-gray-500 pointer-events cursor-pointer">here</a>
                                        <span className="pointer-events-none"> to resend activation email</span>
                            </p>
                            : <>
                                <div className="flex-col justify-center items-center mt-8 text-center text-sm">
                                    <p className="mt-4">Need a new activation link?</p>
                                    <p className="mt-1">Please <Link className="text-gray-400" to={urls.auth.userSignUp.path}>create an account</Link>, or <Link to={urls.auth.userLogin.path}>log in</Link>, and a new link will be sent.</p>
                                </div>
                            </>
                        }
                    </>
                ) : (
                    <>
                        <Alert type="confirm" title="Success">
                            <p className="text-sm">Your account has been activated</p>
                        </Alert>

                        <div className="flex justify-center items-center mt-4">
                            <Link to={urls.root.app.path}><ButtonCancel>Back <ArrowRightIcon className="relative top-1 left-1 w-4" /></ButtonCancel></Link>
                        </div>
                    </>
                ))
            }
        </>

    );
}
