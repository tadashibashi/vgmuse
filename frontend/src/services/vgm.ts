import {FileCache, free, store} from "../api/webassembly";

const _cache = new FileCache();

// Wrap C functions

const _load_vgm = Module.cwrap("load_vgm", "string", ["string"]);
const _load_data = Module.cwrap("load_data", "string", ["number", "number"]);
const _start_track = Module.cwrap("start_track", "string", ["number"]);
const _pause_track = Module.cwrap("pause_track", "string", ["boolean"]);
const _get_buffer = Module.cwrap("get_buffer", "number", []);
const _buffer_bytes = Module.cwrap("buffer_bytes", "number", []);
const _buffer_size = Module.cwrap("buffer_size", "number", []);

const _load_meta = Module.cwrap("load_meta", "string", ["number", "number"]);
const _meta_album_title = Module.cwrap("meta_album_title", "string", ["number"]);
const _meta_author = Module.cwrap("meta_author", "string", ["number"]);
const _meta_track_count = Module.cwrap("meta_track_count", "number", []);


// Error handler, any non-null/non-empty string is an error
const ERR_CHECK = (res: string) => {
    if (res)
        throw new Error(res);
};




export namespace VGMPlayer {

    /**
     * Gets pointer to the buffer in module memory
     */
    export function buffer() {
        const buf = _get_buffer();

        if (!buf)
            throw Error("VGM Player buffer is NULL");

        return new Int16Array(Module.HEAPU8.subarray(buf, buf + _buffer_bytes()).buffer);
    }

    export function startTrack(track: number) {
        ERR_CHECK(_start_track(track));
    }

    export function setPause(pause: boolean) {
        ERR_CHECK(_pause_track(pause));
    }

    /**
     * Loads a temp file for playback. Does not cache data.
     * @param file
     */
    export async function loadFile(file: File) {
        const buffer = await file.arrayBuffer();
        const ptr = store(buffer);

        try {
            ERR_CHECK(_load_data(ptr, buffer.byteLength));

        } catch(e) {
            let message = "VGM loading error";
            if (e instanceof Error)
                message = e.message;

            free(ptr);
            return message;
        }

        free(ptr);
        return "";
    }


    /**
     * Load a VGM file remotely (or locally). Must have CORS permission.
     * @param url - url to load
     */
    export async function load(url: string) {
        const {ptr, bytes} = await _cache.load(url);

        ERR_CHECK(_load_data(ptr, bytes));
    }
}



export namespace VgmMeta {
    /**
     * Load metadata. Must be successfully called before any other VgmMeta function
     */
    export async function load(file: File) {
        const buf = await file.arrayBuffer();
        const ptr = store(buf);

        try {
            ERR_CHECK(_load_meta(ptr, buf.byteLength));
        } catch (e) {
            let message = "VGM loading error";
            if (e instanceof Error) {
                message = e.message;
            }

            free(ptr);
            return message;
        }

        free(ptr);
        return "";
    }

    export function albumTitle() {
        return _meta_album_title(0);
    }

    export function author(track: number = 0) {
        return _meta_author(track);
    }

    export function trackCount() {
        return _meta_track_count();
    }
}
