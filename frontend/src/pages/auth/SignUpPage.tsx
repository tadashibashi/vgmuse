import AuthHeader from "../../components/AuthHeader";
import Form from "../../components/Form.tsx";
import urls from "../../urls";

import {Link, useNavigate} from "react-router-dom";
import Alert from "../../components/Alert.tsx";
import React, {useRef, useState} from "react";
import {FormErrors, hasFormErrors} from "../../utility/formValidation.ts";

import {ArrowPathIcon} from "@heroicons/react/24/solid";
import Spinner from "../../components/icons/Spinner.tsx";


export default function SignUpPage() {
    const [errors, setErrors] = useState<string[]>([]);

    const [sending, setSending] = useState<boolean>(false);

    // flag to prevent multiple submits
    const canSubmitRef = useRef<boolean>(true);

    const navigate = useNavigate();


    function onSuccess(data: unknown) {
        console.log("received:", data);
        setSending(false);
        // TODO: set user here
        navigate(urls.validationEmailSent.path);
    }

    function onValidationError(errors: FormErrors) {
        setErrors(Object.values(errors).map(value => value.message));
        canSubmitRef.current = true;
        setSending(false);
    }

    function shouldSubmit(formData: FormData): boolean {
        if (!canSubmitRef.current) return false;
        canSubmitRef.current = false;

        const matching = formData.get("password") === formData.get("password-confirm");
        if (!matching)
            setErrors(["passwords are mismatched"]);
        else {
            setSending(true);

        }

        return matching;
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthHeader headerText="Create your new account"></AuthHeader>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {errors.length !== 0 &&
                    <Alert type="error"
                           title={errors.length > 1 ? `There were ${errors.length} errors with your submission` : `There was an error with your submission`}
                           className="mb-4"
                           setIsVisible={(value) => setErrors([])}>
                        <ul role="list" className="text-sm list-disc space-y-1 pl-5">
                            {errors.map((error, i) => <li key={"error-" + i}>{error}</li>)}
                        </ul>
                    </Alert>
                }

                <Form action="/api/auth/signup" onSuccess={onSuccess} shouldSubmit={shouldSubmit} onValidationError={onValidationError} className="space-y-6" method="POST">
                    <div>
                        <div className="border-gray-100 rounded">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="off"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="mt-4 border-gray-100 rounded">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="mt-4 border-gray-100 rounded">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>

                            <div className="my-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                />

                            </div>

                        </div>
                        <div className="mt-4 border-gray-100 rounded">
                            <label htmlFor="password-confirm" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>

                            <div className="my-2">
                                <input
                                    id="password-confirm"
                                    name="password-confirm"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                />

                            </div>
                        </div>

                    </div>

                    <div className="mt-24">
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        >
                            {sending && <Spinner className="me-2" bgClass="fill-violet-900" fgClass="fill-violet-200"/>} {sending ? "Processing..." : "Sign up"}
                        </button>
                    </div>
                </Form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    <span className="pointer-events-none">Already a member?{' '}</span>
                    <Link to={urls.userLogin.path} className="font-semibold leading-6 text-violet-600 hover:text-violet-500">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}