#include "sound.h"
#include <SDL_audio.h>

namespace vgmuse::sound {

    static callback_t soundCallback;
    static void *soundCallbackData;
    static SDL_AudioSpec spec;
    static SDL_AudioDeviceID deviceId = 0;

    // the callback wrapper
    static void sdlCallback(void *, uint8_t *out, int count)
    {
        if (soundCallback)
            soundCallback(soundCallbackData, (short *)out, count/2);
    }

    const char *init(int sampleRate, int bufferSize, callback_t callback, void *cbData)
    {
        // cache the user-provided callback for use by the device
        soundCallback = callback;
        soundCallbackData = cbData;

        // set the audio spec
        spec.freq = sampleRate;
        spec.format = AUDIO_S16SYS;
        spec.channels = 2;
        spec.callback = sdlCallback;
        spec.samples = bufferSize;

        // open the device
        if (!(deviceId = SDL_OpenAudioDevice(nullptr, false, &spec, &spec,
                                SDL_AUDIO_ALLOW_FREQUENCY_CHANGE))) {
            auto err = SDL_GetError();
            if (!err)
                err = "Couldn't open SDL Audio";
            return err;
        }

        // success on null
        return nullptr;
    }

    void close()
    {
        stop();
        SDL_CloseAudioDevice(deviceId);
        deviceId = 0;
    }

    void start()
    {
        SDL_PauseAudioDevice(deviceId, false);
    }

    void stop()
    {
        SDL_PauseAudioDevice(deviceId, true);

        // make sure audio thread isn't active
        SDL_LockAudioDevice(deviceId);
        SDL_UnlockAudioDevice(deviceId);
    }
}