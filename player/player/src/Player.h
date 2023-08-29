#pragma once

#include "Error.h"
#include <cstdint>
#include <vector>
#include <string>

namespace vgmuse {


    class Player {

    public:
        Player();
        ~Player();

        static const std::vector<int16_t> &buffer();

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
         */
        error_t load(const char *file);

        [[nodiscard]]
        int current_time() const;

        /**
         * max time for current track
         */
        [[nodiscard]]
        int total_time() const;

        [[nodiscard]]
        std::string album_title() const;

        [[nodiscard]]
        std::string author() const;

        /**
         * get currently playing track, or -1 if no file is loaded
         */
        [[nodiscard]]
        int current_track() const;

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

        [[nodiscard]]
        float volume() const;

        void volume(float v);


        void pause(bool p);
    private:
        friend void fillOutBuffer(void *data, short *out, int count);
        struct Impl;
        Impl *m;
    };
}
