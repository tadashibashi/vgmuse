import Form from "../../components/Form.tsx";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {PlayIcon} from "@heroicons/react/24/solid";
import {VGMPlayer} from "../../services/vgm.ts";
import {MusicalNoteIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import * as vgmAPI from "../../api/vgm.ts";


export default () => {
    const [museFiles, setMuseFiles] = useState<VGMuse.IVgm[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function setupMuseFiles() {
            const vgms = await vgmAPI.search() as VGMuse.IVgm[];
            setMuseFiles(vgms);
        }

        setupMuseFiles();

    }, []);

    function onSearchChange(evt: React.FormEvent<HTMLInputElement>) {
        setSearch(evt.currentTarget.value);
    }

    return (
        <div className="relative">
            <h1 className="text-2xl">Latest Tracks</h1>

            <div className="absolute -top-3 right-0">

                <Form action="" shouldSubmit={() => {

                    vgmAPI.search(search).then(arr => {
                        setMuseFiles(arr as VGMuse.IVgm[]);
                        setSearch("");
                    });

                    return false;
                }}>
                    <div>
                        <label htmlFor="account-number" className="sr-only">
                            Search
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                                type="text"
                                name="search"
                                id="account-number"
                                className="block w-full rounded-md border-0 ps-3 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-400 sm:text-sm sm:leading-6"
                                placeholder="Search"
                                value={search}
                                onChange={onSearchChange}
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 z-100" onClick={(e) => e.stopPropagation()}>
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </Form>

            </div>
            <div className="w-full h-full">
                <div className="flex justify-center">
                    <div className="flex flex-wrap gap-4 justify-start justify-items-start place-items-start h-full w-full">
                        {
                            museFiles.map(file => <div key={file._id.toString()} className="relative col-span-1 row-span-1 w-full sm:w-full md:w-[calc(33%-15px)] lg:w-[calc(20%-14px)] group mt-8">
                                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-40 h-10 w-10 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <PlayIcon onClick={async () => {
                                            await VGMPlayer.load(`https://files.vgmuse.com/${file.fileKey}`);
                                            VGMPlayer.startTrack(0);
                                        }}/>
                                    </div>
                                    <div className="rounded border-[1px] text-gray-200 group-hover:opacity-25 transition-opacity duration-300 flex justify-center items-center aspect-square">
                                        <MusicalNoteIcon className="h-min[10px] h-16 aspect-square" />
                                    </div>
                                    <p className="pt-2 text-center h-10 text-[12px] overflow-hidden">{file.title}</p>

                                </div>
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}
