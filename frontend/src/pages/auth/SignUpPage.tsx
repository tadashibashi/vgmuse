import AuthHeader from "../../components/AuthHeader";
import Form from "../../components/Form.tsx";
import urls from "../../urls";

import {Link, useNavigate} from "react-router-dom";
import Alert from "../../components/Alert.tsx";
import React, {useRef, useState} from "react";
import {FormErrors} from "../../lib/formValidation";

import SpinnerIcon from "../../components/icons/SpinnerIcon.tsx";
import {EnvelopeIcon, LockClosedIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import {Transition} from "@headlessui/react";
import debounce from "../../lib/debounce.ts";
import LoadButton from "../../components/buttons/LoadButton.tsx";


export default function SignUpPage() {
    const [errors, setErrors] = useState<string[]>([]);
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);

    // flag to prevent multiple submits
    const canSubmitRef = useRef<boolean>(true);

    const preventSubmit = useRef(debounce(() => true, 500));

    const navigate = useNavigate();


    function onSuccess(data: unknown) {
        setSending(false);
        setShowErrors(false);
        // TODO: set user here
        navigate(urls.auth.validationEmailSent.path);
    }

    function onValidationError(errors: FormErrors) {
        setErrors(Object.values(errors).map(value => value.message));
        canSubmitRef.current = true;
        setShowErrors(true);
        setSending(false);
    }

    function shouldSubmit(formData: FormData): boolean {
        if (!preventSubmit.current()) {
            return false;
        }

        if (!canSubmitRef.current) return false;
        canSubmitRef.current = false;

        const matching = formData.get("password") === formData.get("password-confirm");
        if (!matching) {
            setErrors(["Passwords are mismatched"]);
            setShowErrors(true);
            setSending(false);
            return false;
        }

        if (formData.get("password") === formData.get("username")) {
            setErrors(["Password must not be the same as username"]);
            setShowErrors(true);
            setSending(false);
            return false;
        }

        setSending(true);
        return true;
    }

    return (
        <>
            <h2 className="my-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 pointer-events-none">
                Register your new account
            </h2>
            <Transition show={showErrors}
                        enter="transition-all ease-in-out duration-150"
                        enterFrom="opacity-0 scale-0 max-h-0"
                        enterTo="opacity-100 scale-100 max-h-full"
                        leave="transition-all ease-in-out duration-300"
                        leaveFrom="opacity-100 max-h-full scale-100"
                        leaveTo="opacity-0 max-h-0 scale-0"
            >
                <Alert type="error"
                       title={errors.length > 1 ? `There were ${errors.length} errors with your submission` : `There was an error with your submission`}
                       className="mb-4"
                       setIsVisible={(value) => setShowErrors(value)}>
                    <ul role="list" className="text-sm list-disc space-y-1 pl-5">
                        {errors.map((error, i) => <li key={"error-" + i}>{error}</li>)}
                    </ul>
                </Alert>
            </Transition>

            <Form action="/api/auth/signup" onSuccess={onSuccess} shouldSubmit={shouldSubmit} onValidationError={onValidationError} className="space-y-6" method="POST">
                <div className="mb-12">
                    <div className="border-gray-100 rounded">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute z-50 -inset-y-px left-0 flex items-center px-1 ring-gray-300 rounded-l">
                                <UserCircleIcon className=" h-8 p-1.5 text-gray-100" aria-hidden="true" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="off"
                                required
                                pattern="\w+"
                                minLength={3}
                                className="block w-full rounded-md border-0 py-1.5 px-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="mt-4 border-gray-100 rounded">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>

                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute z-50 inset-y-0 -left-2 flex items-center pl-3">
                                <EnvelopeIcon className=" h-8 p-1.5 text-gray-100" aria-hidden="true" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="mt-4 border-gray-100 rounded">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>

                        <div className="my-2 relative">
                            <div className="pointer-events-none absolute z-50 -inset-y-px left-0 flex items-center px-1 ring-gray-300 rounded-l">
                                <LockClosedIcon className=" h-8 p-1.5 text-gray-100" aria-hidden="true" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                            />

                        </div>

                    </div>
                    <div className="mt-4 border-gray-100 rounded">
                        <label htmlFor="password-confirm" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>

                        <div className="my-2 relative">
                            <div className="pointer-events-none absolute z-50 -inset-y-px left-0 flex items-center px-1 ring-gray-300 rounded-l">
                                <LockClosedIcon className=" h-8 p-1.5 text-gray-100" aria-hidden="true" />
                            </div>
                            <input
                                id="password-confirm"
                                name="password-confirm"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                            />

                        </div>
                    </div>

                </div>

                <div className="mt-24">
                    <LoadButton text="Sign up" isLoading={sending} type="submit" loadingText="Processing..." />
                </div>
            </Form>

            <p className="mt-10 text-center text-sm text-gray-500">
                <span className="pointer-events-none">Already a member?{' '}</span>
                <Link to={urls.auth.userLogin.path} className="font-semibold leading-6 text-violet-600 hover:text-violet-500">
                    Log in here
                </Link>
            </p>
        </>
    );
}