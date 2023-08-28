#pragma once

#include "Error.h"

namespace vgmuse {


    class Player {
    public:
        Player();
        ~Player();

        /**
         * Initialize the player, which manages its own audio device.
         * Perhaps decouple this for multiple players....
         * @param sampleRate - in Hz
         * @param device - name of the device or nullptr to get reasonable default
         */
        error_t init(int sampleRate=44100, const char *device=nullptr);

        /**
         * Load the vgm file via filename
         * All files should be preloaded in Emscripten
         * @param file
         * @return
         */
        error_t load(const char *file);

        /**
         * Load file from memory
         * @param data - data pointer
         * @param size - size of data in bytes
         */
        error_t load_mem(const void *data, long size);
        void unload();
        error_t start_track(int track);

        [[nodiscard]]
        int trackCount() const;

        void stop();
    private:
        friend void fillOutBuffer(void *data, short *out, int count);
        struct Impl;
        Impl *m;
    };
}
