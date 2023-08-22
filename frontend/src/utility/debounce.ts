/**
 * Returns a function that will only fire once every `ms` milliseconds.
 * Any calls to the function will not happen. The return value will be `undefined` when blocked.
 * @param fn funciton to pass
 * @param ms interval to wait
 */
export default function debounce<Args extends any[], Ret extends any>(fn: (...args: Args) => Ret, ms: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function(...args: Args): Ret | undefined {
        if (timeout === null) {
            timeout = setTimeout(() => timeout = null, ms);
            return fn(...args);
        }
    }
}
