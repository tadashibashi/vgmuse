import AuthHeader from "../../components/AuthHeader";
import FadeIn from "../../components/FadeIn";
import {Routes} from "../../components/Routes";
import urls, {URLDirectory} from "../../urls";

// horrible, horrible one-liner
// todo: refactor into a reusable legible function

export default function AuthPages() {

    const subUrls = Object.entries(urls.auth).reduce( (accum, [key, value]) => ((accum[key] = {path: value.path.substring(5), page: value.page} ), accum), {} as URLDirectory);
    return (
        <FadeIn>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-12 lg:px-8">
                <AuthHeader headerText="Log in to your account" />
            </div>
            <div className="mt-10 mx-8 sm:mx-auto sm:w-full sm:max-w-sm border-gray-100 ">
                <Routes urls={subUrls} />
            </div>
        </FadeIn>
    );
}
