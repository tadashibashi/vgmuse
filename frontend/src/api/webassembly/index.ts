import FileCache from "./FileCache";

export {FileCache};

export type VoidPtr = number;

/**
 * Safely save an array buffer's data into webassembly memory.
 * Make sure to call free on the returned pointer to prevent memory leaks.
 * @param arrayBuffer
 */
export function store(arrayBuffer: ArrayBuffer): VoidPtr {
    const ptr = malloc(arrayBuffer.byteLength);

    try {
        Module.HEAPU8.set(new Uint8Array(arrayBuffer), ptr);
    } catch (err) {
        Module._free(ptr);
        throw err;
    }

    return ptr;
}

/**
 * Safely allocate web assembly memory
 * @param bytes
 */
export function malloc(bytes: number): VoidPtr {
    const ptr = Module._malloc(bytes);
    if (!ptr)
        throw new Error("malloc: out of memory");
    return ptr;
}

/**
 * Frees data at pointer returned from store or malloc
 * @param ptr
 */
export function free(ptr: VoidPtr) {
    Module._free(ptr);
}
