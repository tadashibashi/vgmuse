project(vgmuse-player)

find_package(SDL2)

# add this to CMAKE_EXE_LINKER_FLAGS if we need to preload files
# --preload-file=${CMAKE_CURRENT_BINARY_DIR}@/
if (EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX .js)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_SDL=2 -fsanitize=undefined")
    set(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} \
        -s WASM=1 -s ASYNCIFY \
        -sEXPORTED_FUNCTIONS=_main,_load_vgm,_load_data,_start_track,_pause_track,_current_track,_current_time,_total_time,_get_buffer,_buffer_bytes,_buffer_size,_get_author,_get_album_title,_get_volume,_set_volume,_load_meta,_meta_album_title,_meta_author,_meta_track_count \
        -sEXPORTED_RUNTIME_METHODS=ccall,cwrap \
        -s ALLOW_MEMORY_GROWTH=1 \
    ")
endif()

add_executable(vgmuse-player src/Player.cpp
        src/AudioDevice.cpp
        src/main.cpp
        src/Error.h
        src/Gme.hpp
        src/Error.cpp
        src/MetadataReader.cpp
        src/MetadataReader.h
        src/Wrapper.cpp
        src/Driver.h
        src/Driver.cpp
)

target_include_directories(vgmuse-player PRIVATE
        ${SDL2_INCLUDE_DIRS}
        ${CMAKE_SOURCE_DIR}/lib/gme)

target_link_libraries(vgmuse-player PRIVATE ${SDL2_LIBRARIES} gme)
