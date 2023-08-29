import PlayerControls from "./PlayerControls.tsx";

import React, {useEffect, useRef, useState} from "react";

import {VGMPlayer} from "../../services/vgm";

export default function() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [track, setTrack] = useState(0);
    const [volume, setVolume] = useState(.75);

    const barRef = useRef<HTMLDivElement>(null);
    const interval = useRef<NodeJS.Timeout | null>(null);

    function onVolumeChange(evt: React.FormEvent<HTMLInputElement>) {
        const newVol = parseFloat(evt.currentTarget.value);
        setVolume(newVol);
        VGMPlayer.setVolume(newVol);
        console.log(VGMPlayer.getVolume());
    }


    useEffect(() => {
        // set up delegation listen and unlisten here



        return () => {

        }
    }, []);

    return (
        <>
            <div className="flex flex-1 h-full">

            <div className="grid grid-cols-8 grid-rows-1 h-full w-full gap-4">

                {/*Controls*/}
                <div className="col-span-2 flex p-0 m-0 h-full justify-center text-gray-500 gap-2">
                    <PlayerControls isPlaying={isPlaying}
                                    onPlayClick={() => setIsPlaying(playing => !playing)}
                                    onForwardClick={() => setTrack(track => track + 1)}
                                    onBackClick={() => setTrack(track => track - 1)}
                    />
                </div>


                {/*Track display (album art, name, composer, and time)*/}
                <div className="col-span-5 flex items-center h-full p-0 m-0 group">
                    <section className="flex flex-1 items-center w-full rounded-sm border-[1px] border-gray-100 h-[80%] p-0 m-0">
                        {/*  Album Art Square  */}
                        <section className="h-full aspect-square p-0 m-0">
                            <div className="rounded-l-sm h-full w-full">
                                {/*<img alt="current album artwork" />*/}
                            </div>
                        </section>

                        {/* Right Section */}
                        <div className="h-full flex-grow p-0 m-0 w-auto">

                            {/* Title / Composer */}
                            <div className="grid grid-rows-2 h-[91%] w-auto text-[13px] overflow-hidden">
                                <div className="flex items-center justify-center pt-1.5 text-gray-600 whitespace-nowrap overflow-hidden">Octopath Traveler - Main Theme</div>
                                <div className="flex items-center justify-center text-gray-400 whitespace-nowrap overflow-hidden">Yasunori Nishiki –– Octopath Traveler - Main Theme</div>
                            </div>

                            {/* Play bar */}
                            <div className="h-[9%] w-full bg-gray-200">
                                <div ref={barRef} className="playback-bar bg-gray-500 w-1/2 h-full"></div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="col-span-1 flex justify-center items-center">
                    <input type="range" min={0} max={1} step={.025} onChange={onVolumeChange} value={volume}/>
                </div>
            </div>
            </div>
        </>

    );
}
