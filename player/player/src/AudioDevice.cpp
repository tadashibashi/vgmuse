#include "AudioDevice.h"
#include <SDL_audio.h>

namespace vgmuse {

    // the callback wrapper
    void audioCallbackHandler(void *data, uint8_t *out, int count)
    {
        auto device = static_cast<AudioDevice *>(data);
        if (device && device->callback())
            device->callback()(device->userdata(), (short *)out, count/2);
    }

    struct AudioDevice::Impl {
        Impl(): callback(), userdata(), spec(), id(), isInput(), name() { }
        callback_t callback;
        void *userdata;
        SDL_AudioSpec spec;
        SDL_AudioDeviceID id;
        bool isInput;
        const char *name;
    };

    AudioDevice::AudioDevice() : m(new Impl)
    {

    }

    AudioDevice::AudioDevice(const char *name, bool isInput, int sampleRate,
                             uint16_t bufferSize, callback_t callback,
                             void *userdata) : m(new Impl)
    {
        open(name, isInput, sampleRate, bufferSize, callback, userdata);
    }

    AudioDevice::~AudioDevice()
    {
        close();
        delete m;
    }

    const char *AudioDevice::open(const char *name, bool isInput, int sampleRate,
                                  uint16_t bufferSize, callback_t callback,
                                  void *userdata)
    {
        if (isOpen())
            close();

        // set the audio spec
        SDL_AudioSpec obtained, desired;
        SDL_zero(desired);

        desired = {
            .freq = sampleRate,
            .format = AUDIO_S16SYS,
            .channels = 2,
            .samples = bufferSize,
            .callback = audioCallbackHandler,
            .userdata = this,
        };

        // open the device
        SDL_AudioDeviceID id;
        if (!(id = SDL_OpenAudioDevice(name, isInput, &desired, &obtained,
                                SDL_AUDIO_ALLOW_FREQUENCY_CHANGE))) {
            auto err = SDL_GetError();
            if (!err)
                err = "Couldn't init SDL Audio";
            return err;
        }

        // success, commit data
        m->name = SDL_GetAudioDeviceName((int)id, isInput);
        m->callback = callback;
        m->userdata = userdata;
        m->id = id;
        m->spec = obtained;
        m->isInput = isInput;

        // success on null
        return nullptr;
    }

    bool AudioDevice::isOpen() const {
        return m->id;
    }

    void AudioDevice::close()
    {
        if (isOpen()) {
            stop();
            SDL_CloseAudioDevice(m->id);
            m->id = 0;
        }
    }

    void AudioDevice::start()
    {
        SDL_PauseAudioDevice(m->id, false);
    }

    void AudioDevice::stop()
    {
        SDL_PauseAudioDevice(m->id, true);

        // make sure audio thread isn't active
        SDL_LockAudioDevice(m->id);
        SDL_UnlockAudioDevice(m->id);
    }

    AudioDevice::callback_t AudioDevice::callback()
    {
        return m->callback;
    }

    void *AudioDevice::userdata()
    {
        return m->userdata;
    }

    int AudioDevice::channels() const
    {
        return m->spec.channels;
    }

    bool AudioDevice::isInput() const
    {
        return m->isInput;
    }

    const char *AudioDevice::name() const
    {
        return m->name;
    }

    int AudioDevice::sampleRate() const
    {
        return m->spec.freq;
    }
}