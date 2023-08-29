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
            <div className="grid grid-cols-5 grid-rows-4 gap-2 h-full w-full mt-6 ml-4">
                {
                    museFiles.map(file => <div key={file._id.toString()} className="relative col-span-1 row-span-1 h-40 w-40 group">
                            <div className="absolute top-14 left-16 z-50 h-10 w-10 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayIcon onClick={async () => {
                                    await VGMPlayer.load(`https://files.vgmuse.com/${file.fileKey}`);
                                    VGMPlayer.startTrack(0);
                                }}/>
                            </div>
                            <div className="rounded border-[1px] p-12 text-gray-200 group-hover:opacity-25 transition-opacity duration-300">
                                <MusicalNoteIcon className="h-[80%]" />
                            </div>
                            <p className="pt-2 text-center h-10 text-[12px] overflow-hidden">{file.title}</p>

                        </div>
                    )
                }
            </div>
        </div>
    );
}
