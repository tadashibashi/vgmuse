import FileDropZone from "./FileDropZone.tsx";
import React, {useEffect, useRef, useState} from "react";
import {CloudArrowUpIcon, MusicalNoteIcon} from "@heroicons/react/24/outline";
import {VgmMeta, VGMPlayer} from "../../services/vgm.ts";
import {PlayIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {PauseIcon} from "@heroicons/react/20/solid";
import getAuthor = VGMPlayer.getAuthor;

/**
 *
 * @param className
 * @param fileInputName - sets both id and name of the internal input
 * @param onFile - optional callback when file gets loaded to the dropzone
 */
export default ({className, fileInputName, onFile}: {className?: string, fileInputName: string, onFile?: (file: File) => void}) => {
    const [filename, setFilename] = useState("");
    const [albumTitle, setAlbumTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [trackCount, setTrackCount] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const PlaybackIcon = isPlaying ? PauseIcon : PlayIcon;

    async function onFiles(files: FileList) {
        const input = inputRef.current;
        if (!input) return;

        const file = files[0];

        try {
            await VgmMeta.load(file);

            if (albumTitle === VGMPlayer.getAlbumTitle()) {
                VGMPlayer.setPause(true);
            }

            setAuthor(VgmMeta.author());
            setAlbumTitle(VgmMeta.albumTitle());
            setTrackCount(VgmMeta.trackCount());

        } catch(e) {
            setAuthor("Incompatible file type");
            return;
        }

        // limit upload to one file
        const dt = new DataTransfer();
        dt.items.add(file);

        input.files = dt.files;
        setFilename(input.files[0].name.replace("C:\\fakepath\\", ""));
        if (onFile) onFile(file);
    }

    function clearFiles() {
        const input = inputRef.current;
        if (!input) return;

        input.files = new DataTransfer().files;
        setFilename("");
        setAuthor("");
        setAlbumTitle("");
        setTrackCount(0);

        VGMPlayer.setPause(true);
    }

    function onFilenameChange(evt: React.FormEvent<HTMLInputElement>) {
        setFilename(evt.currentTarget.value.replace("C:\\fakepath\\", ""));
    }

    async function onClickPlayback(evt: React.MouseEvent) {
        if (isPlayingLoadedAlbum()) {
            VGMPlayer.setPause(!VGMPlayer.getPaused());
        } else {
            if (inputRef.current?.files?.length) {
                await VGMPlayer.loadFile(inputRef.current.files[0]);
                VGMPlayer.startTrack(0);
            }
        }
    }



    function isPlayingLoadedAlbum() {
        return albumTitle !== "" && VGMPlayer.getAlbumTitle() === albumTitle;
    }


    const albumTitleRef = useRef("");
    albumTitleRef.current = albumTitle;





    useEffect(() => {
        const onPlayPause = (data: {albumTitle: string, author: string, track: number, isPaused: boolean}) => {
            const albumTitle = albumTitleRef.current;
            if (data.albumTitle === albumTitle && albumTitle) {
                setIsPlaying(!data.isPaused);
            }
        }

        const onTrackStart = (data: {albumTitle: string, author: string, track: number}) => {
            const albumTitle = albumTitleRef.current;
            if (data.albumTitle === albumTitle && albumTitle) {
                setIsPlaying(true);
            }
        }

        VGMPlayer.onPlayPause.addListener(onPlayPause);
        VGMPlayer.onTrackStart.addListener(onTrackStart);
        return () => {
            VGMPlayer.onPlayPause.removeListener(onPlayPause);
            VGMPlayer.onTrackStart.removeListener(onTrackStart);
        };
    }, []);


    return (
        <div className={className}>
            <FileDropZone
                className={"flex justify-center rounded-lg group mb-4 " +
                    (filename ? "border-[1px] border-gray-50 shadow-md" : "border border-dashed border-gray-900/25 ") +
                    (dragActive ? "bg-gray-50" : "")}
                onFiles={onFiles}
                isDragActive={dragActive}
                setDragActive={setDragActive}
            >
                {
                    filename ?
                        (
                            <div className="grid grid-cols-3 w-full h-full relative">
                                <div className="absolute top-2 right-2">
                                    <XMarkIcon
                                        className="h-6 w-6 text-gray-300 hover:bg-gray-50 hover:border-[1px] hover:text-red-100 active:text-red-300 border-gray-100 rounded border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        onClick={() => clearFiles()}
                                    />
                                </div>
                                <PlaybackIcon className="text-gray-300 h-16 m-auto absolute top-12 left-12 group-hover:opacity-100 opacity-0 transition-opacity duration-300" onClick={onClickPlayback} />
                                <div
                                    className="select-none relative drop-shadow-sm py-12 col-span-1 flex flex-col justify-center items-center opacity-100 group-hover:opacity-10 transition-opacity duration-300"
                                    onClick={onClickPlayback}
                                >

                                    <MusicalNoteIcon className="text-gray-300 h-16 m-auto" />
                                    <p className="text-tiny text-gray-200 mt-2 select-none">{"File contains " + trackCount + " " + (trackCount > 1 ? "tracks" : "track")} </p>
                                </div>
                                <div className="px-6 py-10 col-span-2 flex flex-col  border-l-[1px] border-gray-50">
                                    <h2 className="text-gray-600 text-lg font-bold drop-shadow-sm">{albumTitle || "Untitled"}</h2>
                                    <p className="text-gray-400 text-sm mb-2">by {author || "Unknown"}</p>
                                    <p className="text-gray-300 text-sm">{filename}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-100" />
                                <p className="text-center text-lg">{filename}</p>
                                <div className="mt-4 flex justify-center items-center text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor={fileInputName}
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-violet-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-600 focus-within:ring-offset-2 hover:text-violet-500"
                                    >
                                    <span>Upload a file</span>


                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-400">GBS, NSF, VGM, or other format up to 2MB</p>
                                <p>{author}</p>
                            </div>
                        )
                }

                <input ref={inputRef} id={fileInputName} name={fileInputName} type="file" className="sr-only" onChange={onFilenameChange} />
            </FileDropZone>

        </div>

    );
}