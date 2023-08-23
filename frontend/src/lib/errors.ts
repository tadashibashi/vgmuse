
enum StatusCode {
    InvalidRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
}

export class HttpError extends Error {

    constructor(
        private readonly statusCode: number,
        statusText: string) {

        super(statusText);
    }


    /**
     * User is logged in, but is forbidden to access the resources due to credential type
     */
    isForbidden() {
        return this.statusCode === StatusCode.Forbidden;
    }


    /**
     * Parameters or headers were invalid
     */
    isInvalidRequest() {
        return this.statusCode === StatusCode.InvalidRequest;
    }


    /**
     * No resource found at endpoint
     */
    isNotFound() {
        return this.statusCode === StatusCode.NotFound;
    }


    /**
     * User cannot access the resources due to unauthentication or lack of credentials
     */
    isUnauthorized() {
        return this.statusCode >= StatusCode.Unauthorized && this.statusCode <= StatusCode.Forbidden;
    }


    /**
     * User is not authenticated (session should end)
     */
    isUnauthenticated() {
        return this.statusCode === StatusCode.Unauthorized;
    }

    /**
     * Some server error happened
     */
    isInternal() { // Internal server errors are 500-599
        return this.statusCode >= 500 && this.statusCode < 600;
    }


    /**
     * Error code returned from the API
     */
    get status() {
        return this.statusCode;
    }
}
