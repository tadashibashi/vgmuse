import AuthHeader from "../../components/AuthHeader";
import Form from "../../components/Form.tsx";
import urls from "../../urls";
import {Link} from "react-router-dom";

import {PaperAirplaneIcon} from "@heroicons/react/24/outline";


export default function ValidationEmailSentPage() {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthHeader headerText="Thank you for registering!" className="mb-4"/>
            <PaperAirplaneIcon className="mx-auto animate-pulse -mb-2" width="4vmin" />
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <p className="text-center mb-2">A verification email was just sent to your address.</p>
                <p className="text-center">Please click the activation link inside to complete your registration.</p>
            </div>

        </div>
    );
}