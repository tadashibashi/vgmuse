project(vgmuse-player)

find_package(SDL2)


if (EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX .js)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_SDL=2 -fsanitize=undefined")
    set(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} --preload-file=${CMAKE_CURRENT_BINARY_DIR}@/ -s WASM=1 -s ASYNCIFY -sEXPORTED_FUNCTIONS=_main,_load_vgm,_load_data -sEXPORTED_RUNTIME_METHODS=ccall,cwrap -s ALLOW_MEMORY_GROWTH=1")
endif()

add_executable(vgmuse-player src/Player.cpp
        src/AudioDevice.cpp
        src/main.cpp
        src/Error.h
        src/Gme.hpp
        src/Error.cpp)

target_include_directories(vgmuse-player PRIVATE
        ${SDL2_INCLUDE_DIRS}
        ${CMAKE_SOURCE_DIR}/lib/gme)

target_link_libraries(vgmuse-player PRIVATE ${SDL2_LIBRARIES} gme)
