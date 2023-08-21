import AuthHeader from "../../components/AuthHeader";
import Form from "../../components/Form.tsx";
import urls from "../../urls";

import {Link} from "react-router-dom";
import {FormErrors} from "../../utility/formValidation";
import Alert from "../../components/Alert.tsx";
import {useState} from "react";


export default function LogInPage() {
    const [errors, setErrors] = useState<string[]>([]);
    function onValidationError(errors: FormErrors) {
        setErrors(Object.values(errors).map(err => err.message));
    }

    function onSuccess(data: unknown) {
        console.log(data);
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthHeader headerText="Log in to your account" />



            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-gray-100">
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

                <Form action="/api/auth/login" onValidationError={onValidationError} onSuccess={onSuccess} className="space-y-6" method="POST">
                    <div className="relative -space-y-px rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Password"
                            />
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
                            <Link to={urls.userSignUp.path} className="font-semibold text-violet-600 hover:text-violet-500">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        >
                            Sign in
                        </button>
                    </div>
                </Form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to={urls.userSignUp.path} className="font-semibold leading-6 text-violet-600 hover:text-violet-500">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}