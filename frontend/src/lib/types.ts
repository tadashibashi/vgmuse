
export interface IError {
    name: string;
    message: string;
}

export interface IServerError extends IError {
    statusCode: number;
}


/**
 * Namespace for duck-type validation of unknown data,
 * mainly for JSON data received from the backend.
 */
export namespace Is {
    export function error(val: any): val is IError {
        return val && typeof val === "object" &&
            typeof val.name === "string" &&
            typeof val.message === "string";
    }

    export function serverError(val: any): val is IServerError {
        return error(val) && typeof (val as any).statusCode === "number";
    }


    export function errorContainer(val: any): val is {error: IError} {
        return val && typeof val === "object" && error(val.error);
    }

    export function serverErrorContainer(val: any): val is {error: IServerError} {
        return val && typeof val === "object" && serverError(val.error);
    }

    export function errorsContainer(val: any): val is {errors: Record<string, IError>} {
        if (!(val && typeof val === "object" &&
            typeof val.errors === "object"))
            return false;

        for (const err of Object.values(val)) {
            if (!error(err))
                return false;
        }

        return true;
    }


    export function user(user: any): user is VGMuse.Frontend.User {
        if (!user) return false;


        return !!(user && user.username && user.userType && user.email && user.fingerprint);
    }

    export function userContainer(val: any): val is {user: VGMuse.Frontend.User} {
        if (!val) return false;

        return user(val.user);
    }
}

