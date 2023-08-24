import AuthHeader from "../../components/AuthHeader";
import FadeIn from "../../components/FadeIn";
import {Routes} from "../../components/Routes";
import urls, {URLDirectory} from "../../urls";
import {XMarkIcon} from "@heroicons/react/24/solid";
import React from "react";
import {Link} from "react-router-dom";

// horrible, horrible one-liner
// todo: refactor into a reusable legible function

export default function AuthPages() {

    const subUrls = Object.entries(urls.auth).reduce( (accum, [key, value]) => ((accum[key] = {path: value.path.substring(5), page: value.page} ), accum), {} as URLDirectory);
    return (
        <FadeIn>
            <Link
                to={urls.root.landingPage.path}
                type="button"
                className="absolute right-8 top-6 w-8 inline-flex rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </Link>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-12 lg:px-8">
                <AuthHeader headerText="Log in to your account" />
            </div>

            <div className="mt-10 mx-8 sm:mx-auto sm:w-full sm:max-w-sm border-gray-100 ">
                <Routes urls={subUrls} />
            </div>
        </FadeIn>
    );
}
