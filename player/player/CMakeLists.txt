project(vgmuse-player)

find_package(SDL2)

add_executable(vgmuse-player src/Player.cpp
        src/AudioDevice.cpp
        src/main.cpp)

target_include_directories(vgmuse-player PRIVATE
        ${SDL2_INCLUDE_DIRS}
        ${CMAKE_SOURCE_DIR}/lib/gme)

target_link_libraries(vgmuse-player PRIVATE ${SDL2_LIBRARIES} gme)
