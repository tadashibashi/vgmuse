#include "Player.h"
#include "AudioDevice.h"

#include "Gme.hpp"
#include "Error.h"
#include <iostream>
#include <string>

namespace vgmuse {

    static std::vector<int16_t> buf{};

    struct TrackInfo {
        std::string game{};
        std::string title{};
        int play_length{};
        int length{};
        int fade_length{};
        std::string author{};
    };

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
        TrackInfo track_info;
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

        m->audio.stop();
        ERR_CHECK(gme_start_track(m->emu, track));

        m->current_track = track;
        m->paused = false;

        gme_info_t *info;
        ERR_CHECK(gme_track_info(m->emu, &info, m->current_track));

        // Calculate track length
        if ( info->length <= 0 )
            info->length = info->intro_length +
                           info->loop_length * 2;

        if ( info->length <= 0 )
            info->length = (long) (2.5 * 60 * 1000);

        m->track_info.play_length = info->play_length;
        m->track_info.fade_length = info->fade_length < 0 ? 0 : info->fade_length;
        m->track_info.game = std::string(info->game);
        m->track_info.author = std::string(info->author);
        m->track_info.length = info->length;
        m->track_info.title = std::string(info->song);

        if (m->track_info.fade_length <= 0)
            gme_set_fade(m->emu, -1, m->track_info.fade_length);
        else
            gme_set_fade(m->emu, m->track_info.length, m->track_info.fade_length);

        gme_free_info(info);

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
        return m->track_info.length;
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

        return m->track_info.game;
    }

    std::string Player::author() const
    {
        if (!m->emu) return "";

        return m->track_info.author;
    }

    bool Player::pause() const
    {
        return m->paused;
    }

    void Player::update()
    {
        if (!m->emu || m->paused) return;

        if (current_time() >= m->track_info.length) {
            int next_track = m->current_track + 1;
            if (next_track >= track_count())
                pause(true);
            else
                start_track(next_track);
        }
    }

    bool Player::track_ended() const
    {
        if (!m->emu) return false;

        return gme_track_ended(m->emu);
    }

}