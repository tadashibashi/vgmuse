#pragma once

#include "Error.h"

namespace vgmuse {


    class Player {
    public:
        Player();
        ~Player();

        error_t init(int sampleRate=44100, const char *device=nullptr);

        error_t load(const char *file);
        error_t loadData(const void *data, long size);
        void unload();
        void startTrack(int track);
        void stop();
    private:
        friend void fillBuffer(void *data, short *out, int count);
        struct Impl;
        Impl *m;
    };
}
