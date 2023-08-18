import {free, store, VoidPtr} from ".";
import {fetchFile} from "../requests";

interface FileData {
    bytes: number;
    ptr: VoidPtr;
}

/**
 * Caches files in WebAssembly on client-side for quick local access.
 * Idea for use: look-ahead download for future songs in a playlist, etc.
 */
class FileCache {
    private readonly _files: Map<string, FileData>;
    private _queue: string[];
    private readonly _maxBytes: number;
    private _bytes: number;

    constructor(limit: number = 1024 * 1024 * 2 /* 2MB */) {
        this._files = new Map();
        this._queue = [];
        this._maxBytes = limit;
        this._bytes = 0;
    }

    /**
     * Number of files stored in the cache.
     */
    get fileCount() { return this._files.size; }

    /**
     * Current storage size.
     */
    get byteSize() { return this._bytes; }

    /**
     * Maximum storage size.
     */
    get maxBytes() { return this._maxBytes; }

    /**
     * Load data into memory (if not already in memory), get the pointer to that data.
     * @param url - url to load (most-likely from database)
     */
    async load(url: string) {

        // check if it's already in the cache
        const fileInfo = this._files.get(url);

        // get the pointer to the data
        let data: FileData;
        if (fileInfo) {   // if file is already in cache
            data = fileInfo;
        } else {          // if file must be retrieved & stored
            const fileBuffer = await fetchFile(url);

            // check if file too big for cache
            if (fileBuffer.byteLength > this._maxBytes) {
                throw new Error(`File too large for cache: bytes=${fileBuffer.byteLength}, max=${this._maxBytes}`);
            }

            // unload old file data to make room for new
            while (fileBuffer.byteLength + this._bytes > this._maxBytes) {
                if (this._queue.length === 0)
                    throw Error("FileCache: internal error, queue unexpectedly has no items");
                this.unload(this._queue.shift()!);
            }

            data = {
                ptr: store(fileBuffer),
                bytes: fileBuffer.byteLength,
            };

            this._bytes += fileBuffer.byteLength;
            this._files.set(url, data);
            this._queue.push(url);
        }

        return data;
    }


    /**
     * Unload a file.
     * Queue will not be searched and deleted - intended to be called when
     * checking queue!
     * @param url - url of file to unload
     * @return boolean - whether file was unloaded; if file w/ url doesn't exist it will return false.
     */
    private unload(url: string): boolean {
        const fileData = this._files.get(url);
        if (fileData) {
            free(fileData.ptr);
            this._bytes -= fileData.bytes;
            this._files.delete(url);
        }

        return !!fileData;
    }


    /**
     * Clear the cache of all file data.
     */
    clear() {
        for (const [url, info] of this._files)
            free(info.ptr);

        this._files.clear();
        this._queue.length = 0;
        this._bytes = 0;
    }
}

export default FileCache;
