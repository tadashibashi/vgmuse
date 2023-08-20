import {
    XCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon, XMarkIcon
} from "@heroicons/react/24/solid";

import React, {PropsWithChildren} from "react";

interface Props extends PropsWithChildren {
    title?: string;

    /**
     * Passing this callback allows an X close button to be rendered.
     * When this button is clicked, setIsVisible will be passed a false value.
     */
    setIsVisible?: (v: boolean) => void;

    /**
     * Sets the icon and color for the alert, default: "info", which is blue.
     */
    type?: "confirm" | "info" | "warning" | "error";

    className?: string;
}



export default function Alert({title, setIsVisible, children, type, className}: Props) {
    let Icon = CheckCircleIcon;
    let color = "";

    if (!type)
        type = "info";

    switch(type) {
        case "confirm":
            color = "green"
            Icon = CheckCircleIcon;
            break;
        case "info":
            color = "blue";
            Icon = InformationCircleIcon;
            break;
        case "warning":
            color = "yellow";
            Icon = ExclamationTriangleIcon;
            break;
        case "error":
            color = "red";
            Icon = XCircleIcon;
            break;
    }

    // Dynamic tailwind classes
    // bg-green-50 bg-yellow-50 bg-blue-50 bg-red-50
    // hover:bg-green-100 hover:bg-yellow-100 hover:bg-blue-100 hover:bg-red-100
    // text-green-400 text-yellow-400 text-blue-400 text-red-400
    // text-green-700 text-yellow-700 text-blue-700 text-red-700
    // text-green-800 text-yellow-800 text-blue-800 text-red-800
    // focus:ring-offset-green-50 focus:ring-offset-yellow-50 focus:ring-offset-blue-50 focus:ring-offset-red-50
    // focus:ring-green-600 focus:ring-yellow-600 focus:ring-blue-600 focus:ring-red-600
    return (
        <div className={`rounded-md bg-${color}-50 p-4 text-${color}-700 ${className ? className : ""}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 text-${color}-400`} aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <div className="mb-1">
                        {title && <h3 className={`text-sm font-medium text-${color}-800`}>{title}</h3>}
                    </div>
                    <div>
                        {children}
                    </div>
                </div>

                {
                    setIsVisible &&
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                className={`inline-flex rounded-md bg-${color}-50 p-1.5 text-${color}-500 hover:bg-${color}-100 focus:outline-none focus:ring-2 focus:ring-${color}-600 focus:ring-offset-2 focus:ring-offset-${color}-50`}
                                onClick={() => setIsVisible(false)}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}