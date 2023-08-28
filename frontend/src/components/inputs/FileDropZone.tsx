import {useState, DragEvent, RefObject, useRef, PropsWithChildren} from "react";

interface Props extends PropsWithChildren {
    onFiles: (files: FileList) => void;
    className?: string;

    isDragActive: boolean;
    setDragActive: VGMuse.StateSetter<boolean>;
}


export default ({onFiles, children, className, isDragActive, setDragActive}: Props) => {

    function onDrag(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.type === "dragenter" || evt.type === "dragover") {
            setDragActive(true);
        } else if (evt.type === "dragleave") {
            setDragActive(false);
        }
    }

    function onDrop(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();

        // ensure that there is at least one file available
        if (evt.dataTransfer.files.length) {

            // send callback
            onFiles(evt.dataTransfer.files);
        }

        setDragActive(false);
    }

    return (
        <div className={"relative " + (className || "")}  onDragEnter={onDrag} onDragOver={onDrag}>
            {children}
            {
                isDragActive &&
                <div
                    className="absolute top-0 left-0 w-full h-full z-50 "
                    onDragEnter={onDrag}
                    onDragOver={onDrag}
                    onDragLeave={onDrag}
                    onDrop={onDrop}
                />
            }
        </div>
    );

}
