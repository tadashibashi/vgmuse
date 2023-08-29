#include "Player.h"
#include "AudioDevice.h"

#include "Gme.hpp"
#include "Error.h"
#include <iostream>

namespace vgmuse {

    static std::vector<int16_t> buf{};

    struct Player::Impl {
        Impl(): audio{}, emu{}, current_track{} {}
        ~Impl()
        {
            if (emu)
                gme_delete(emu);
        }

        // borrowed ptr
        AudioDevice audio;

        Music_Emu *emu;

        int current_track;
    };

    void fillOutBuffer(void *data, short *out, int count)
    {
        auto m = static_cast<Player::Impl *>(data);
        if (m->emu)
            gme_play(m->emu, count, out);

        std::copy(out, out + count, buf.begin());
    }

    Player::Player(): m(new Impl)
    {

    }

    Player::~Player() { delete m; }

    const int BUFSIZE = 1024;

    const char *Player::init(int sampleRate, const char *device)
    {
        buf.assign(BUFSIZE * 2, 0);
        return m->audio.open(device, false, sampleRate, BUFSIZE, fillOutBuffer, this->m);
    }

    void Player::stop()
    {
        m->audio.stop();
    }

    error_t Player::start_track(int track)
    {
        if (!m->emu) return "Emu is not loaded";

        ERR_CHECK(gme_start_track(m->emu, track));
        m->audio.start();

        return SUCCESS;
    }

    error_t Player::load(const char *file)
    {
        Music_Emu *emu = nullptr;
        ERR_CHECK(gme_open_file(file, &emu, m->audio.sampleRate()));

        if (m->emu)
            gme_delete(m->emu);
        m->emu = emu;
        m->current_track = 0;
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

    void Player::pause(bool p)
    {
        if (p)
            m->audio.stop();
        else
            m->audio.start();
    }


    const std::vector<int16_t> &Player::buffer()
    {
        return buf;
    }

    int Player::current_time() const
    {
        return m->emu ? gme_tell(m->emu) : 0;
    }

    int Player::current_track() const
    {
        return m->emu ? gme_start_track();
    }

}