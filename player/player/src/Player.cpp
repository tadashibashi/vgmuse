#include "Player.h"
#include "AudioDevice.h"

#include "Gme.hpp"
#include "Error.h"
#include <iostream>
#include <atomic>

namespace vgmuse {

    static std::vector<int16_t> buf{};

    struct Player::Impl {
        Impl(): audio{}, emu{}, current_track{}, volume{.75}, paused(true) {}
        ~Impl()
        {
            if (emu)
                gme_delete(emu);
        }

        // borrowed ptr
        AudioDevice audio;

        Music_Emu *emu;

        int current_track;
        float volume;
        bool paused;
    };

    void fillOutBuffer(void *data, short *out, int count)
    {
        auto m = static_cast<Player::Impl *>(data);

        if (m->emu) {
            gme_play(m->emu, count, out);
            for (int i = 0; i < count; ++i)
                out[i] = (short)((float)out[i] * m->volume);
            std::copy(out, out + count, buf.begin());
        }
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
        if (m->emu) {
            gme_delete(m->emu);
            m->emu = nullptr;
        }
    }


    int Player::track_count() const
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
        m->paused = p;
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
        return m->emu ? m->current_track : -1;
    }



    int Player::total_time() const
    {
        if (!m->emu) return 0;

        gme_info_t *info;
        auto result = gme_track_info(m->emu, &info, m->current_track);

        if (result) return 0;

        int time = info->play_length;

        gme_free_info(info);

        return time;
    }

    float Player::volume() const
    {
        return m->volume;
    }

    void Player::volume(float v)
    {
        m->volume = v;
    }

    std::string Player::album_title() const
    {
        if (!m->emu) return "";

        gme_info_t *info;
        auto result = gme_track_info(m->emu, &info, m->current_track);

        if (result) return "";

        std::string title(info->game);

        gme_free_info(info);

        return title;
    }

    std::string Player::author() const
    {
        if (!m->emu) return "";

        gme_info_t *info;
        auto result = gme_track_info(m->emu, &info, m->current_track);

        if (result) return "";

        std::string author(info->author);

        gme_free_info(info);

        return author;
    }

    bool Player::pause() const
    {
        return m->paused;
    }

}