import FileDropZone from "./FileDropZone.tsx";
import React, {useRef, useState} from "react";
import {CloudArrowUpIcon, MusicalNoteIcon} from "@heroicons/react/24/outline";

/**
 *
 * @param className
 * @param fileInputName - sets both id and name of the internal input
 */
export default ({className, fileInputName}: {className?: string, fileInputName: string}) => {
    const [filename, setFilename] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    function onFiles(files: FileList) {
        const input = inputRef.current;
        if (!input) return;

        // limit upload to one file
        const dt = new DataTransfer();
        dt.items.add(files[0]);

        input.files = dt.files;
        setFilename(input.files[0].name.replace("C:\\fakepath\\", ""));
    }

    function onFilenameChange(evt: React.FormEvent<HTMLInputElement>) {
        setFilename(evt.currentTarget.value.replace("C:\\fakepath\\", ""));
    }


    return (
        <div className={className}>
            <FileDropZone
                className={"flex justify-center rounded-lg px-6 py-10 " +
                    (filename ? "border-0" : "border border-dashed border-gray-900/25 ") +
                    (dragActive ? "bg-gray-50" : "")}
                onFiles={onFiles}
                isDragActive={dragActive}
                setDragActive={setDragActive}
            >
                <div className="text-center">
                    {filename ? <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-300"  /> : <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-300" />}
                    <p className="text-center text-lg">{filename}</p>
                    <div className="mt-4 flex justify-center items-center text-sm leading-6 text-gray-600">
                        <label
                            htmlFor={fileInputName}
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-violet-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-600 focus-within:ring-offset-2 hover:text-violet-500"
                        >
                            {filename ? <span>Replace file</span> : <span>Upload a file</span>}
                            <input ref={inputRef} id={fileInputName} name={fileInputName} type="file" className="sr-only" onChange={onFilenameChange} />

                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-400">GBS, NSF, VGM, or other format up to 2MB</p>

                </div>
            </FileDropZone>
        </div>

    );
}