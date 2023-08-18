import {FileCache} from "../api/webassembly";

const _cache = new FileCache();

const _loadData = Module.cwrap("load_data", "string", ["number", "number"]);


/**
 *
 * @param url - url to load
 */
export async function loadFile(url: string) {
    const {ptr, bytes} = await _cache.load(url);

    const err = _loadData(ptr, bytes);
    if (err)
        throw Error(err);
}
