#pragma once

namespace vgmuse {

    class Player {
    public:
        Player();
        ~Player();

        const char *open(int sampleRate=44100, const char *device=nullptr);
        void stop();
    private:
        struct Impl;
        Impl *m;
    };
}
