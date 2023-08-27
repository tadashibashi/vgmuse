import React, {RefObject, useRef, useState} from "react";
import {CloudArrowUpIcon, MusicalNoteIcon} from "@heroicons/react/24/outline";
import Form from "../../components/Form.tsx";


export default function() {
    //@ts-ignore
    const fileInputEl: RefObject<HTMLInputElement> = useRef();

    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadFilename, setUploadFilename] = useState("");

    function onDragEnter(evt: React.DragEvent) {
        if (evt.target === evt.currentTarget)
            setIsDragActive(true);
    }

    function onDrag(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
                setIsDragActive(true);
            } else if (e.type === "dragleave") {
                setIsDragActive(false);
            }
    }

    async function onDrop(evt: React.DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        const fileInput = fileInputEl.current;
        console.log(evt.dataTransfer.files);
        if (evt.dataTransfer.files && evt.dataTransfer.files.length && fileInput) {
            const dt = new DataTransfer();
            dt.items.add(evt.dataTransfer.files[0]);

            fileInput.files = dt.files;
            setUploadFilename(fileInput.files[0].name);
        }
        setIsDragActive(false);
    }

    async function onChange(evt: React.FormEvent<HTMLInputElement>) {
        setUploadFilename(evt.currentTarget.value);
    }


    return (
        <div onDrop={e => e.preventDefault()}>
        <Form action="api/vgm/create" shouldSubmit={() => false}>

            <div className="col-span-full">
                <div className="mt-2 relative flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                    onDragEnter={onDrag} onDragOver={onDrag}>
                    <div className="text-center">
                        {uploadFilename ? <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-300"  /> : <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-300" />}
                        <p className="text-center text-lg">{uploadFilename}</p>
                        <div className="mt-4 flex justify-center items-center text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-violet-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-600 focus-within:ring-offset-2 hover:text-violet-500"
                            >
                                {uploadFilename ? <span>Replace file</span> : <span>Upload a file</span>}
                                <input ref={fileInputEl} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onChange} />

                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">GBS, NSF, VGM, or other format up to 2MB</p>

                    </div>
                    {
                        isDragActive && <div className="absolute top-0 left-0 w-full h-full z-50 bg-gray-50 opacity-50 rounded-md" onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}></div>
                    }
                </div>

            </div>
        </Form>

        </div>
    );
}