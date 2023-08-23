
export class ServerError extends Error {
    statusCode: number;

    constructor(statusCode: number, message?: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Indicates an invalid request, either mandatory params are missing or invalid syntax
 * found in parameters, etc.
 */
export class InvalidRequestError extends ServerError {
    constructor(message?: string) {
        super(400, message || "invalid request");
        this.name = "InvalidRequestError";
    }
}

/**
 * User is not authenticated, and has no authorization to access resources at end point.
 */
export class UnauthorizedError extends ServerError {
    constructor(message?: string) {
        super(401, message || "unauthorized");
        this.name = "UnauthorizedError";
    }
}

/**
 * Server understands the request, but can't provide access
 * due to insufficient authorization rights from the user.
 * E.g. a user trying to access private page of another user.
 */
export class ForbiddenError extends ServerError {
    constructor(message?: string) {
        super(403, message || "forbidden");
        this.name = "ForbiddenError";
    }
}

/**
 * There was no resource at the server end point
 */
export class NotFoundError extends ServerError {
    constructor(message?: string) {
        super(404, message || "not found");
        this.name = "NotFoundError";
    }
}

export class UnimplementedError extends Error {
    constructor(functionName?: string) {
        super((functionName ? functionName : "Function") + " is not implemented!");
        this.name = "UnimplementedError";
    }
}
