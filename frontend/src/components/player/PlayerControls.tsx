import {BackwardIcon, ForwardIcon, PlayIcon} from "@heroicons/react/24/solid";
import {PauseIcon} from "@heroicons/react/20/solid";
import React from "react";

interface Props {
    isPlaying: boolean;
    onPlayClick?: (evt: React.MouseEvent) => void;
    onForwardClick?: (evt: React.MouseEvent) => void;
    onBackClick?: (evt: React.MouseEvent) => void;
}

export default ({isPlaying, onPlayClick, onForwardClick, onBackClick}: Props) => {
    const PlayPauseIcon = isPlaying ? PauseIcon : PlayIcon;

    return (
    <>
        <div onClick={onBackClick} className="flex justify-center items-center h-[50%] my-auto aspect-square hover:bg-gray-50 rounded-md">
            <BackwardIcon className="h-[85%] cursor-pointer active:text-gray-600" />
        </div>
        <div onClick={onPlayClick} className="flex justify-center items-center h-[50%] my-auto aspect-square hover:bg-gray-50 rounded-md">
            <PlayPauseIcon className="h-[85%] cursor-pointer my-auto active:text-gray-600" />
        </div>
        <div onClick={onForwardClick} className="flex justify-center items-center h-[50%] my-auto aspect-square hover:bg-gray-50 rounded-md">
            <ForwardIcon className="h-[85%] cursor-pointer my-auto active:text-gray-600" />
        </div>
    </>
    );
}
