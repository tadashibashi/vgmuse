
export class APIError extends Error {

    constructor(
        private readonly statusCode: number,
        statusText: string) {

        super(statusText);
    }

    /**
     * Error code returned from the API
     */
    get status() {
        return this.statusCode;
    }
}
