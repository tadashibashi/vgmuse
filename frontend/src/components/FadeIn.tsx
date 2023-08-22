import {PropsWithChildren, useEffect, useState} from "react";
import {Transition} from "@headlessui/react";


export default function FadeIn({children}: PropsWithChildren ) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        setTimeout(() => setShow(true), 50);
    }, []);

    return (
        <Transition show={show}
            enter="transition-opacity duration-1000 ease-in-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-1000 ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            {children}
        </Transition>
    );
}