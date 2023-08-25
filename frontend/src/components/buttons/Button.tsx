import React, {PropsWithChildren} from "react";

export interface ButtonProps extends PropsWithChildren {
    type?: "button" | "submit";
    onClick?: (evt: React.MouseEvent) => void;
    className?: string;
}

export default ({type, onClick, children, className}: ButtonProps) => {
    return (
        <button type={type || "button"}
                onClick={onClick}
                className={className}>
            {children}
        </button>
    );
}