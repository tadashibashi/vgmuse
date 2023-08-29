import React, {useRef, useState} from "react";
import Form from "../../components/Form.tsx";
import LoadButton from "../../components/buttons/LoadButton.tsx";
import {FormErrors} from "../../lib/formValidation.ts";
import {navigateService} from "../../services";
import urls from "../../urls.tsx";
import {Transition} from "@headlessui/react";
import Alert from "../../components/Alert.tsx";
import VGMDropZone from "../../components/inputs/VGMDropZone.tsx";
import {VgmMeta} from "../../services/vgm.ts";


export default function() {

    const [isSendingForm, setIsSendingForm] = useState(false);

    const [errors, setErrors] = useState<string[]>([]);
    const [showErrors, setShowErrors] = useState<boolean>(false);

    const titleInputRef = useRef<HTMLInputElement>(null);

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
                   title={errors.length > 1 ? `There were ${errors.length} errors on submitting your file` : `There was an error on submitting your file`}
                   className="mb-6"
                   setIsVisible={(value) => {setShowErrors(value);}}>
                <ul role="list" className="text-sm list-disc space-y-1 pl-5">
                    {errors.map((error, i) => <li key={"error-" + i}>{error}</li>)}
                </ul>
            </Alert>
        </Transition>


        <Form action="/api/vgm" method="POST" shouldSubmit={onShouldSubmit} onValidationError={onValidationError} onSuccess={onSuccess} className="max-w-lg mx-auto" catchException={catchException}>

            {/*Title*/}
            <div className="sr-only">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 mt-4">
                    Title
                </label>
                <div className="mt-2">
                    <input
                        ref={titleInputRef}
                        type="text"
                        name="title"
                        id="title"
                        className="block w-full rounded-md border-0 ps-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                    />
                </div>
            </div>

            {/*VGM Upload Panel*/}
            <div className="col-span-full mt-4">
                <VGMDropZone fileInputName="file-upload" onFile={() => { if (titleInputRef.current) titleInputRef.current.value = VgmMeta.albumTitle() }} />
            </div>


            <LoadButton className="mt-4" type="submit" isLoading={isSendingForm} loadingText="Processing..." text="Upload" />
        </Form>

        </div>
    );
}