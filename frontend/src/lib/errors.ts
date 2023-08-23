import {Is} from "./types.ts";

export class ServerError extends Error {

    constructor(
        private readonly statusCode: number,
        statusText: string) {

        super(statusText);
    }


    /**
     * User is logged in, but is forbidden to access the resources due to credential type
     */
    isForbidden() {
        return this.statusCode === 403;
    }


    /**
     * Parameters or headers were invalid
     */
    isInvalidRequest() {
        return this.statusCode === 400;
    }


    isNotFound() {
        return this.statusCode === 404;
    }


    /**
     * User cannot access the resources due to unauthentication or lack of credentials
     */
    isUnauthorized() {
        return this.statusCode >= 401 && this.statusCode <= 403;
    }


    // User is not authenticated (session should end)
    isUnauthenticated() {
        return this.statusCode === 401;
    }

    /**
     * Error code returned from the API
     */
    get status() {
        return this.statusCode;
    }
}
