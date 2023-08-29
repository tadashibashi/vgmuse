#include "Driver.h"
#include <exception>

using namespace vgmuse;

extern "C" {

    error_t load_vgm(const char *path)
    {
        ERR_CHECK(player.load(path));
        ERR_CHECK(player.start_track(0));
        return SUCCESS;
    }

    error_t load_data(const void *data, long size)
    {
        ERR_CHECK(player.load_mem(data, size));
        ERR_CHECK(player.start_track(0));
        return SUCCESS;
    }

    error_t start_track(int track) {
        return player.start_track(track);
    }

    error_t pause_track(bool p) {
        try {
            player.pause(p);
            return SUCCESS;
        }
        catch(const std::exception &e)
        {
            return e.what();
        }
        catch(...)
        {
            return "Pause error";
        }
    }

    bool track_paused() {
        return player.pause();
    }

    int track_count() {
        return player.track_count();
    }

    int current_track() {
        return player.current_track();
    }

    int current_time() {
        return player.current_time();
    }

    int total_time() {
        return player.total_time();
    }

    const int16_t *get_buffer() {
        return vgmuse::Player::buffer().data();
    }

    size_t buffer_bytes() {
        return vgmuse::Player::buffer().size() * sizeof(int16_t);
    }

    size_t buffer_size() {
        return vgmuse::Player::buffer().size();
    }

    const char *get_author() {
        static std::string author;
        author = player.author();
        return author.c_str();
    }

    const char *get_album_title() {
        static std::string album_title;
        album_title = player.album_title();
        return album_title.c_str();
    }

    float get_volume() {
        return player.volume();
    }

    void set_volume(float v) {
        player.volume(v);
    }

    error_t load_meta(const void *data, long size)
    {
        return meta.load_mem(data, size);
    }

    const char *meta_album_title(int track = 0)
    {
        auto info = meta.load_track_info(track);
        return info ? info->game : nullptr;
    }

    const char *meta_author(int track = 0)
    {
        auto info = meta.load_track_info(track);
        return info ? info->author : nullptr;
    }

    int meta_track_count()
    {
        return meta.track_count();
    }

}