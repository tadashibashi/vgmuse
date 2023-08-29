#include "Driver.h"
#include <SDL.h>
#include <iostream>

vgmuse::Player player;
vgmuse::MetadataReader meta;

void test_meta() {
    meta.open_file("test.nsf");
    auto info = meta.load_track_info(0);
    std::cout << info->game << '\n';
    std::cout << info->author << '\n';
    std::cout << info->copyright << '\n';
}

void test_player() {
    player.load("test.nsf");
    player.start_track(0);
}

#ifdef EMSCRIPTEN
#include <emscripten.h>

void em_main() {
    player.update();
}

#endif

void driver() {
    if (SDL_Init(SDL_INIT_AUDIO) != 0)
    {
        std::cerr << "Failed to init sdl2!\n";
        return;
    }

    auto res = player.init();
    if (res)
        std::cerr << res << '\n';

#ifdef EMSCRIPTEN
    emscripten_set_main_loop(em_main, 20, true);
#else
    bool isRunning = true;
    while(isRunning) {
        SDL_Event ev;
        while(SDL_PollEvent(&ev)) {
            if (ev.type == SDL_QUIT)
                isRunning = false;
        }
        SDL_Delay(64);
    }
#endif

    SDL_Quit();
};