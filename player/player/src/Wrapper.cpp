#include "Driver.h"

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