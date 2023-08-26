import Button from "./Button.tsx";
import React, {PropsWithChildren} from "react";

interface Props extends PropsWithChildren {
    type?: "button" | "submit";
    onClick?: (evt: React.MouseEvent) => void;
}

export default ({children, type}: Props) => {
    return (
        <Button type={type} className="flex w-full bg-transparent justify-center rounded-md border-2 border-gray-300 px-3 py-1.5 text-sm font-semibold
            leading-6 text-gray-400 hover:border-gray-200 hover:text-gray-300 focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-violet-600">
            {children}
        </Button>
    );
};
