#include "Driver.h"
#include <SDL.h>
#include <iostream>

vgmuse::Player player;
vgmuse::MetadataReader meta;

void test_meta() {
    meta.load_file("test.nsf");
    auto info = meta.load_track_info(0);
    std::cout << info->game << '\n';
    std::cout << info->author << '\n';
    std::cout << info->copyright << '\n';
}

void driver() {
    if (SDL_Init(SDL_INIT_AUDIO) != 0)
    {
        std::cerr << "Failed to init sdl2!\n";
        return;
    }

    auto res = player.init();
    if (res)
        std::cerr << res << '\n';


    bool isRunning = true;
    while(isRunning) {
        SDL_Event ev;
        while(SDL_PollEvent(&ev)) {
            if (ev.type == SDL_QUIT)
                isRunning = false;
        }
        SDL_Delay(64);
    }

    SDL_Quit();
};