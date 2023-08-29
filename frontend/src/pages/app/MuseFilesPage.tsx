import {useEffect, useState} from "react";
import * as vgmAPI from "../../api/vgm";
import {getUser} from "../../api/auth.ts";
import {MusicalNoteIcon} from "@heroicons/react/24/outline";
import {PlayIcon} from "@heroicons/react/24/solid";
import {VGMPlayer} from "../../services/vgm.ts";

export default () => {

    const [museFiles, setMuseFiles] = useState<VGMuse.IVgm[]>([]);

    useEffect(() => {
        async function setupMuseFiles() {
            const user = getUser();
            if (!user) return;

            const vgms = await vgmAPI.getAll(user.username) as VGMuse.IVgm[];
            setMuseFiles(vgms);
        }

        setupMuseFiles();

    }, []);


    return (
        <div className="w-full h-full">
            <h1 className="text-2xl">Muse Files</h1>
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
    );
}
