import {NextFunction, Request as ExpressRequest, Response} from "express";
import {Types} from "mongoose";


declare global {
    namespace VGMuse {
        namespace Frontend {
            type User = Omit<IUser, "password" | "comparePasswords" | "isStaff" | "isAdmin" | "createdAt" | "updatedAt"> &
                {fingerprint?: string, _id: string};
        }

        interface FileData {
            buffer: Buffer;
            filename: string;
            mimetype: string;
            encoding: string;
        }

        type Request = ExpressRequest & {
            user?: Frontend.User & {isStaff?: boolean, isAdmin?: boolean},
            files?: Record<string, FileData>;
        };

        type UserType = "user" | "staff" | "admin";

        export type MiddlewareFunction = ((req: Request, res: Response, next: NextFunction) => void) |
            ((req: Request, res: Response, next: NextFunction) => Promise<void>);


        export interface ISchema {
            _id: Types.ObjectId;
        }

        /**
         * Add onto an interface if timestamps is true,
         * and left with default named fields
         */
        export interface ITimeStamps {
            createdAt: Date;
            updatedAt: Date;
        }

        interface IUser extends ISchema, ITimeStamps {
            username: string;
            email: string;
            password: string;
            isValidated: boolean;
            userType: UserType;

            isStaff: boolean;
            isAdmin: boolean;
            checkPassword: (password: string) => Promise<boolean>;
        }

        interface IVgm extends ISchema, ITimeStamps {
            title: string; // unique to user
            fileKey: string;
            slug: string; // unique to user
            user: Types.ObjectId; // user id
            isPublished: boolean;
        }

        interface IFormErrors {
            errors: Record<string, IFormError>;
        }

        interface IError {
            message: string;
            name: string;
        }

        interface IFormError extends IError {
            field: string;
        }

        interface IServerError extends IError {
            statusCode: number;
        }
    }
}
