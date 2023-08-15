#include "AudioDevice.h"
#include <iostream>
#include <SDL.h>

using namespace vgmuse;

int main(int argc, char *argv[]) {
    SDL_Init(SDL_INIT_AUDIO);

    AudioDevice device;
    auto result = device.open(nullptr, false, 48000, 256, nullptr, nullptr);
    if (result) {
        std::cout << result << '\n';
        return 1;
    }

    std::cout << device.name() << " was initialized\n";
    std::cout << "shutting down\n";
    device.close();

    SDL_Quit();
    return 0;
}