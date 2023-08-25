import {FaVolumeHigh, FaVolumeLow, FaVolumeOff, FaVolumeXmark} from "react-icons/fa6";
import {IconType} from "react-icons";

const volumeIcons: IconType[] = [FaVolumeXmark, FaVolumeOff, FaVolumeLow, FaVolumeHigh];

/**
 * Volume component displays icon depending on how loud the track is
 * @param volume - percentage between 0-1
 * @param className - optional classes to add
 */
export default ({volume, className}: {volume: number, className?: string}) => {
    const index = volume ? Math.min(Math.floor(volume * (volumeIcons.length-1) + 1), volumeIcons.length-1) : 0;
    const VolumeIcon = volumeIcons[index];

    return (
        <VolumeIcon className={className}/>
    );
};
