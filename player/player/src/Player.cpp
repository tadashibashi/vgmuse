#include "Player.h"
#include <gme/gme.h>
#include <SDL.h>

namespace vgmuse {

    struct Player::Impl {
        Impl() {}
        ~Impl() {}


    };



    Player::Player(): m(new Impl) {}
    Player::~Player() { delete m; }

    void Player::stop()
    {
        SDL_PauseAudio(true);

        SDL_LockAudio();
        SDL_UnlockAudio();
    }

}