/**
 * Lower-level sound api, not meant for public use.
 */
#pragma once

#include <cstdint>

namespace vgmuse {


    class AudioDevice {
    public:
        using callback_t = void(*)(void *data, short *out, int count);

        AudioDevice();

        /**
         * Open the AudioDevice on creation.
         * Check AudioDevice::isOpen if it was successful or not.
         * @param name - name of the audio device - left null, it will find the best fit
         * @param isInput - whether this should be an input capturing or output device
         * @param sampleRate - audio sample rate
         * @param bufferSize - buffer size in sample frames (total samples divided by channel count)
         * @param callback - callback to feed device, pass nullptr to use SDL_QueueAudio() instead.
         * @param userdata - data to retrieve as void * in callback
         */
        AudioDevice(const char *name, bool isInput, int sampleRate,
                    uint16_t bufferSize, callback_t callback,
                    void *userdata);
        ~AudioDevice();

        /**
         * Initialize audio driver
         * @param name - name of the audio device - left null, it will find the best fit
         * @param isInput - whether this should be an input capturing or output device
         * @param sampleRate - audio sample rate
         * @param bufferSize - buffer size in sample frames (total samples divided by channel count)
         * @param callback - callback to feed device, pass nullptr to use SDL_QueueAudio() instead.
         * @param userdata - data to retrieve as void * in callback
         */
        const char *open(const char *name, bool isInput, int sampleRate, uint16_t bufferSize, callback_t callback, void *userdata);

        /**
         * Check if audio device was successfully opened.
         */
        [[nodiscard]]
        bool isOpen() const;

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


        /**
         * Get the number of audio channels for this device.
         */
        [[nodiscard]]
        int channels() const;

        /**
         * Whether device is input-capturing or output.
         */
        [[nodiscard]]
        bool isInput() const;

        /**
         * Name of audio device.
         */
        [[nodiscard]]
        const char *name() const;

        /**
         * Sample rate of the audio device.
         */
        [[nodiscard]]
        int sampleRate() const;

    private:
        friend void audioCallbackHandler(void *data, uint8_t *out, int count);
        callback_t callback();
        void *userdata();

        struct Impl;
        Impl *m;
    };

}
