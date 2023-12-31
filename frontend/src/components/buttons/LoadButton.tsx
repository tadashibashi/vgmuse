import SpinnerIcon from "../icons/SpinnerIcon.tsx";
import React, {PropsWithChildren, useState} from "react";
import Button, {ButtonProps} from "./Button.tsx";
import ButtonPrimary from "./ButtonPrimary.tsx";


interface Props extends ButtonProps {
    text: string | React.JSX.Element;
    isLoading: boolean;
    loadingText?: string | React.JSX.Element;
    onClick?: (evt: React.MouseEvent) => void;
}


export default function LoadButton(p: Props) {

    return (
          <ButtonPrimary type={p.type || "button"} className={p.className}
                  onClick={p.onClick}>
                      {p.isLoading && <SpinnerIcon className="me-2" bgClass="fill-violet-900" fgClass="fill-violet-200"/>} {p.isLoading ? p.loadingText || p.text : p.text}
          </ButtonPrimary>
    );
}
