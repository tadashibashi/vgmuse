import Spinner from "./icons/Spinner";
import React, {PropsWithChildren, useState} from "react";


interface Props extends PropsWithChildren {
    text: string | React.JSX.Element;
    isLoading: boolean;
    loadingText?: string | React.JSX.Element;
    type?: "button" | "submit";
    onClick?: (evt: React.MouseEvent) => void;
}


export default function LoadButton({text, loadingText, isLoading, type, onClick}: Props) {

    return (
          <button type={type || "button"}
                  onClick={onClick}
                  className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
                      {isLoading && <Spinner className="me-2" bgClass="fill-violet-900" fgClass="fill-violet-200"/>} {isLoading ? loadingText || text : text}
          </button>
    );
}
