import AuthHeader from "../../components/AuthHeader";
import Form from "../../components/Form.tsx";
import urls from "../../urls";

import {Link} from "react-router-dom";
import Alert from "../../components/Alert.tsx";
import {useState} from "react";

export default function SignUpPage() {
    const [showError, setShowError] = useState(true);
    const [errors, setErrors] = useState<string[]>(["password length must be 10"]);

    function onResponse(data: unknown) {
        console.log("received:", data);
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthHeader headerText="Create your new account"></AuthHeader>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {showError && errors.length !== 0 &&
                    <Alert type="error" title="Sign Up Error" className="mb-4" setIsVisible={setShowError}>
                        <ul role="list" className="text-sm list-disc">
                            {errors.map((error, i) => <li key={"error-" + i}>{error}</li>)}
                        </ul>
                    </Alert>
                }

                <Form action="/api/auth/signup" onResponse={onResponse} className="space-y-6" method="POST">
                    <div>
                        <div>
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

                        <div className="mt-2 border-gray-100 rounded">
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

                    </div>

                    <div    >
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        >
                            Sign up
                        </button>
                    </div>
                </Form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <Link to={urls.userLogin.path} className="font-semibold leading-6 text-violet-600 hover:text-violet-500">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}