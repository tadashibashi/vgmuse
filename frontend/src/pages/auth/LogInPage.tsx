import Form from "../../components/Form";
import urls from "../../urls";

import {Link, useNavigate} from "react-router-dom";
import {FormErrors} from "../../utility/formValidation";
import Alert from "../../components/Alert";
import {useState} from "react";
import Spinner from "../../components/icons/Spinner";

import {Transition} from "@headlessui/react";
import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/outline";

export default function LogInPage() {
    const [errors, setErrors] = useState<string[]>([]);
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const navigate = useNavigate();

    function onValidationError(errors: FormErrors) {
        setErrors(Object.values(errors).map(err => err.message));
        setShowErrors(true);
        setSending(false);
    }

    function onSuccess(data: unknown) {
        setSending(false);
        setShowErrors(false);
        console.log(data);
        navigate(urls.root.landingPage.path);
    }

    function shouldSubmit() {
        setSending(true);
        return true;
    }

    return (
        <>
            <h2 className="my-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 pointer-events-none">
                Log in to your account
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
                       className="mb-6"
                       setIsVisible={(value) => {setShowErrors(value);}}>
                    <ul role="list" className="text-sm list-disc space-y-1 pl-5">
                        {errors.map((error, i) => <li key={"error-" + i}>{error}</li>)}
                    </ul>
                </Alert>
            </Transition>

            <Form action="/api/auth/login" onValidationError={onValidationError} onSuccess={onSuccess} shouldSubmit={shouldSubmit} className="space-y-6" method="POST">
                <div className="relative -space-y-px rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute z-50 inset-y-0 -left-2 flex items-center pl-3">
                                <EnvelopeIcon className=" h-8 p-1.5 text-gray-100" aria-hidden="true" />
                            </div>

                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative w-full rounded-t-md border-0 py-1.5 px-10 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Email address"
                            />
                        </div>

                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute z-50 inset-y-0 -left-2 flex items-center pl-3">
                                <LockClosedIcon className="h-8 text-gray-100 p-1.5" aria-hidden="true" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 px-10 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Password"
                            />
                        </div>


                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm leading-6">
                        <Link to={urls.auth.userSignUp.path} className="font-semibold text-violet-600 hover:text-violet-500">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        {sending && <Spinner className="me-2" bgClass="fill-violet-900" fgClass="fill-violet-200"/>} {sending ? "Processing..." : "Log in"}
                    </button>
                </div>
            </Form>

            <p className="mt-10 text-center text-sm text-gray-500">
                <span className="pointer-events-none">Not a member?{' '}</span>
                <Link to={urls.auth.userSignUp.path} className="font-semibold leading-6 text-violet-600 hover:text-violet-500">
                    Sign up here
                </Link>
            </p>
        </>
    );
}