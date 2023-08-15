#pragma once

namespace vgmuse {

    class Player {
    public:
        Player();
        ~Player();

        void stop();
    private:
        struct Impl;
        Impl *m;
    };
}
