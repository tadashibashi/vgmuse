#pragma once
#ifndef VGMUSE_ERROR_H
#define VGMUSE_ERROR_H

namespace vgmuse {
    using error_t = const char *;

    extern error_t SUCCESS;
}

#undef ERR_CHECK
#define ERR_CHECK(expr) do {                  \
        const vgmuse::error_t result = (expr); \
        if (result) return result;             \
    } while(0)

#endif
