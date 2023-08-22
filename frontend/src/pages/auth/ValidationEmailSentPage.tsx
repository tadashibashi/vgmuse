import urls from "../../urls";
import {Link} from "react-router-dom";

import {EnvelopeIcon, PaperAirplaneIcon} from "@heroicons/react/24/outline";


export default function ValidationEmailSentPage() {
    return (
        <>
            <EnvelopeIcon className="mx-auto animate-pulse -mb-2 mt-16" width="4vmin" />
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <p className="text-center mb-2">A verification email was just sent to your address.</p>
                <p className="text-center">Please click the activation link inside to complete your registration.</p>

                <Link to={urls.root.landingPage.path}>Go to User Home</Link>
            </div>
        </>
    );
}
