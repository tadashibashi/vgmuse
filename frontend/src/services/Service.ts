/**
 * Service provider paradigm, to give wider access to an object
 */
export class Service<T> {
    private _service: T | null;

    constructor() {
        this._service = null;
    }

    set(service: T) {
        this._service = service;
    }

    get() {
        if (!this._service)
            throw ReferenceError("Service was retrieved before it was set");
        return this._service;
    }
}
