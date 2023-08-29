#pragma once

#include <cstdio>
#include "Error.h"
#include "gme/gme.h"

namespace vgmuse {
    class MetadataReader {
        struct Impl;
    public:
        MetadataReader();
        ~MetadataReader();

        error_t load_mem(const void *data, size_t byte_size);
        error_t open_file(const char *path);

        [[nodiscard]]
        const gme_info_t *load_track_info(int track) const;

        [[nodiscard]]
        int track_count() const;
    private:
        Impl *m;
    };
}

