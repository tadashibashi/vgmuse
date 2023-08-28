import PlayerControls from "./player/PlayerControls.tsx";

import {useState} from "react";

export default function() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [track, setTrack] = useState(0);

    return (
        <>
            <div className="flex flex-1 h-full">

            <div className="grid grid-cols-6 grid-rows-1 h-full w-full">

                {/*Controls*/}
                <div className="col-span-2 flex p-0 m-0 h-full justify-center text-gray-500 gap-2">
                    <PlayerControls isPlaying={isPlaying}
                                    onPlayClick={() => setIsPlaying(playing => !playing)}
                                    onForwardClick={() => setTrack(track => track + 1)}
                                    onBackClick={() => setTrack(track => track - 1)}
                    />
                </div>


                {/*Track display (album art, name, composer, and time)*/}
                <div className="col-span-3 flex items-center h-full p-0 m-0 group">
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
                            <div className="grid grid-rows-2 h-[91%] w-auto text-[13px]">
                                <div className="flex items-center justify-center pt-1.5 text-gray-600">Octopath Traveler - Main Theme</div>
                                <div className="flex items-center justify-center text-gray-400">Yasunori Nishiki –– Octopath Traveler - Main Theme</div>
                            </div>

                            {/* Play bar */}
                            <div className="h-[9%] w-full bg-gray-200">
                                <div className="playback-bar bg-gray-500 w-1/2 h-full"></div>
                            </div>
                        </div>
                    </section>


                </div>
            </div>
            </div>
        </>

    );
}
