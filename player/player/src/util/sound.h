/**
 * Lower-level sound api, not meant for public use.
 */
#pragma once

#include <cstdint>

/**
 * TODO: refactor into AudioDevice
 */
namespace vgmuse::sound {
    using callback_t = void(*)(void *data, short *out, int count);

    /**
     * Initialize audio driver via sdl2
     */
    const char *init(int sampleRate, int bufferSize, callback_t callback, void *cbData);

    /**
     * Shutdown audio driver
     */
    void close();

    /**
     * Start audio thread
     */
    void start();

    /**
     * Stop/pause audio thread
     */
    void stop();
}
