interface IError {
    message: string;
    name: string;
}

export function createFormErrors(errors: VGMuse.IFormError | VGMuse.IFormError[]): VGMuse.IFormErrors {
    const e: VGMuse.IFormErrors = { errors: {} };
    if (Array.isArray(errors)) {
        errors.forEach(error => {
            e.errors[error.field] = error;
        });
    } else {
        e.errors[errors.field] = errors;
    }

    return e;
}





export class ServerError extends Error {
    statusCode: number;

    constructor(statusCode: number, message?: string) {
        super();
        this.message = message || "";
        this.statusCode = statusCode;
    }
}

export class InternalError extends ServerError {
    constructor(message?: string) {
        super(500, message || "internal error");
        this.name = "Internal Error";
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

export class FormError extends ServerError {
    errors: Record<string, IError>;

    /**
     * Put 400 for user error, 500 for any server error
     */
    constructor(errOrCode: number | ServerError = 400) {
        if (typeof errOrCode === "number")
            super(errOrCode, "form error");
        else
            super(errOrCode.statusCode, errOrCode.message);

        this.errors = {};
    }

    pushError(fieldName: string, error: Error | IError | string) {
        if (typeof error === "string") {

        } else {
            this.errors[fieldName] = {
                name: error.name,
                message: error.message,
            };
        }
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
