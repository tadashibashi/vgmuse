import {URLDirectory, URLInfo} from "../urls";


// TODO: kind of a dirty workaround, try to refactor this later...
export function getSubpaths(subUrls: URLDirectory) {
    const index: URLInfo | undefined = subUrls.index;

    if (!index) return subUrls;

    return Object.entries(subUrls).reduce( (accum, [key, value]) => {
        if (key === "index") return accum;

        accum[key] = {
            path: index.path ? value.path.substring(index.path.length) : value.path,
            page: value.page,
        };

        return accum;

    }, {} as URLDirectory);
}
