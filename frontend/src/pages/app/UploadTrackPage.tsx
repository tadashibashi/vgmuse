import React, {RefObject, useRef, useState} from "react";
import {CloudArrowUpIcon, MusicalNoteIcon} from "@heroicons/react/24/outline";
import Form from "../../components/Form.tsx";
import ButtonPrimary from "../../components/buttons/ButtonPrimary.tsx";
import LoadButton from "../../components/buttons/LoadButton.tsx";
import {FormErrors} from "../../lib/formValidation.ts";
import {navigateService} from "../../services";
import urls from "../../urls.tsx";
import {Transition} from "@headlessui/react";
import Alert from "../../components/Alert.tsx";

const TIMEOUT_TIME = 10000; // 10 seconds

export default function() {
    //@ts-ignore
    const fileInputEl: RefObject<HTMLInputElement> = useRef();

    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadFilename, setUploadFilename] = useState("");

    const [isSendingForm, setIsSendingForm] = useState(false);

    const [errors, setErrors] = useState<string[]>([]);
    const [showErrors, setShowErrors] = useState<boolean>(false);

    const [uploadTimeout, setUploadTimeout] = useState<NodeJS.Timeout | null>(null);

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

    function onChange(evt: React.FormEvent<HTMLInputElement>) {
        setUploadFilename(evt.currentTarget.value);
    }




    function onValidationError(e: FormErrors) {
        setIsSendingForm(false);
        setErrors(Object.values(e).map(e => e.message));
        setShowErrors(true);
    }

    function onShouldSubmit(data: any) {
        setIsSendingForm(true);
        setShowErrors(false);
        return true;
    }

    function onSuccess(obj: unknown) {
        console.log(obj);
        setIsSendingForm(false);
        setShowErrors(false);
        navigateService.get()(urls.app.myTracks.path);
    }

    function catchException(err: unknown) {
        const errors: any = err;
        if (typeof errors.message === "string")
            setErrors([errors.message]);
        setShowErrors(true);
        setIsSendingForm(false);
    }


    return (
        <div onDrop={e => e.preventDefault()}>
        <Transition show={showErrors}
                    enter="transition-all ease-in-out duration-150"
                    enterFrom="opacity-0 scale-0 max-h-0"
                    enterTo="opacity-100 scale-100 max-h-full"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom="opacity-100 max-h-full scale-100"
                    leaveTo="opacity-0 max-h-0 scale-0"
        >
            <Alert type="error"
                   title={errors.length > 1 ? `There were ${errors.length} errors with your submission` : `There was an error with your submission`}
                   className="mb-6"
                   setIsVisible={(value) => {setShowErrors(value);}}>
                <ul role="list" className="text-sm list-disc space-y-1 pl-5">
                    {errors.map((error, i) => <li key={"error-" + i}>{error}</li>)}
                </ul>
            </Alert>
        </Transition>

        <Form action="/api/vgm" method="POST" shouldSubmit={onShouldSubmit} onValidationError={onValidationError} onSuccess={onSuccess} className="max-w-lg mx-auto" catchException={catchException}>

            {/*VGM Upload Panel*/}
            <div className="col-span-full">
                <div className={"mt-2 relative flex justify-center rounded-lg  px-6 py-10 " + (uploadFilename ? "border-0" : "border border-dashed border-gray-900/25")}
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

            {/*Title*/}


            <LoadButton className="mt-4" type="submit" isLoading={isSendingForm} loadingText="Processing..." text="Upload" />
        </Form>

        </div>
    );
}