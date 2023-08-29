#include "MetadataReader.h"
#include "gme/Music_Emu.h"
#include <stdexcept>

struct vgmuse::MetadataReader::Impl {
    Impl() : emu(), track_queried(-1), track_info() { }

    ~Impl()
    {
        close();
    }

    error_t open_mem(const void *data, size_t size)
    {
        Music_Emu *temp_emu;
        ERR_CHECK( gme_open_data(data, size, &temp_emu, 44100) );

        close();
        emu = temp_emu;

        // load first track out of convenience
        ERR_CHECK(load_track_info(0));

        return SUCCESS;
    }

    error_t open_file(const char *path)
    {
        Music_Emu *temp;
        ERR_CHECK(gme_open_file(path, &temp, 44100));

        if (emu)
            gme_delete(emu);
        emu = temp;

        return SUCCESS;
    }

    error_t load_track_info(int track) {
        if (!emu) throw std::runtime_error("Emu is not loaded");
        if (track == track_queried)
            return SUCCESS;

        gme_info_t *temp;

        ERR_CHECK(gme_track_info(emu, &temp, track));

        close_info();
        track_info = temp;
        track_queried = track;

        return SUCCESS;
    }

    const gme_info_t *info() const {
        return track_info;
    }

    [[nodiscard]]
    int track_count() const {
        return emu ? emu->track_count() : 0;
    }

    void close()
    {
        close_info();
        if (emu)
        {
            gme_delete(emu);
            emu = nullptr;
            track_queried = -1;
        }
    }

    void close_info() {
        if (track_info)
        {
            gme_free_info(track_info);
            track_info = nullptr;
        }

    }

    Music_Emu *emu;
    mutable int track_queried;
    mutable gme_info_t *track_info;
};


vgmuse::MetadataReader::MetadataReader() : m(new Impl)
{

}

vgmuse::MetadataReader::~MetadataReader()
{
    delete m;
}

vgmuse::error_t vgmuse::MetadataReader::load_mem(const void *data, size_t byte_size)
{
    ERR_CHECK(m->open_mem(data, byte_size));

    return SUCCESS;
}

const gme_info_t *vgmuse::MetadataReader::load_track_info(int track) const
{
    error_t result;
    result = m->load_track_info(track);
    if (result != SUCCESS)
        return nullptr;

    return m->info();
}

int vgmuse::MetadataReader::track_count() const
{
    return m->track_count();
}

vgmuse::error_t vgmuse::MetadataReader::open_file(const char *path)
{
    return m->open_file(path);
}
