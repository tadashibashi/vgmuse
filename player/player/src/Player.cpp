#include "Player.h"
#include "AudioDevice.h"

#include "Gme.hpp"
#include "Error.h"
#include <iostream>

namespace vgmuse {

    struct Player::Impl {
        Impl(): audio{}, emu{} {}
        ~Impl()
        {
            if (emu)
                gme_delete(emu);
        }

        // borrowed ptr
        AudioDevice audio;

        Music_Emu *emu;
    };

    void fillOutBuffer(void *data, short *out, int count)
    {
        auto m = static_cast<Player::Impl *>(data);
        if (m->emu)
            gme_play(m->emu, count, out);
    }

    Player::Player(): m(new Impl)
    {

    }

    Player::~Player() { delete m; }

    const char *Player::init(int sampleRate, const char *device)
    {
         return m->audio.open(device, false, sampleRate, 512, fillOutBuffer, this->m);
    }

    void Player::stop()
    {
        m->audio.stop();
    }

    error_t Player::start_track(int track)
    {
        if (m->emu)
        {
            ERR_CHECK(gme_start_track(m->emu, track));
            m->audio.start();
            return SUCCESS;
        }
        else
            return "Emu is not loaded";
    }

    error_t Player::load(const char *file)
    {
        Music_Emu *emu = nullptr;
        ERR_CHECK(gme_open_file(file, &emu, m->audio.sampleRate()));

        if (m->emu)
            gme_delete(m->emu);
        m->emu = emu;

        return SUCCESS;
    }

    error_t Player::load_mem(const void *data, long size)
    {
        Music_Emu *emu = nullptr;
        ERR_CHECK(gme_open_data(data, size, &emu, m->audio.sampleRate()));
        if (m->emu)
            gme_delete(m->emu);
        m->emu = emu;

        return SUCCESS;
    }

    void Player::unload()
    {
        m->audio.stop();

    }

    int Player::trackCount() const
    {
        if (!m->emu) return 0;

        return gme_track_count(m->emu);
    }

}