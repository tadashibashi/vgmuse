import Button from "./Button.tsx";
import React, {PropsWithChildren} from "react";


interface Props extends PropsWithChildren {
    type?: "button" | "submit";
    onClick?: (evt: React.MouseEvent) => void;
    className?: string;
}


export default ({children, type, className}: Props) => {
    return (
        <div className={className}>
            <Button type={type} className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold
            leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-violet-600">
                {children}
            </Button>
        </div>
    );
};
