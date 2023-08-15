#include "Player.h"
#include "AudioDevice.h"
#include <gme/gme.h>
#include <SDL.h>

namespace vgmuse {

    struct Player::Impl {
        Impl(): audio{} {}
        ~Impl()
        {
            audio.close();
        }

        AudioDevice audio;
    };

    static void fillBuffer(void *data, short *out, int count)
    {
        auto player = static_cast<Player *>(data);
    }

    Player::Player(): m(new Impl)
    {


    }

    Player::~Player() { delete m; }

    const char *Player::open(int sampleRate, const char *device)
    {
         return m->audio.open(device, false, sampleRate, 512, fillBuffer, this);
    }



    void Player::stop()
    {
        SDL_PauseAudio(true);

        SDL_LockAudio();
        SDL_UnlockAudio();
    }

}