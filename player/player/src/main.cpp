#include "Player.h"
#include <iostream>
#include <SDL.h>

using namespace vgmuse;

Player player;

extern "C" {
    void load_vgm(const char *path) {
        player.load(path);
        player.startTrack(0);
    }
}

extern "C" {
void load_data(void *data, long size) {
    player.loadData(data, size);
    player.startTrack(0);
}
}

int main(int argc, char *argv[]) {
    if (SDL_Init(SDL_INIT_AUDIO) != 0)
        return 1;

    SDL_Delay(1000);
    auto res = player.init();
    if (res)
        std::cerr << res << '\n';

    res = player.load("https://bitbucket.org/tadashibashi/gme-vgmuse/src/master/test.nsf");
    if (res)
        std::cerr << res << '\n';

    int track = 0;
    player.startTrack(track);

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
    return 0;
}