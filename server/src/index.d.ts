import {NextFunction, Request as ExpressRequest, Response} from "express";
import {Types} from "mongoose";



declare global {
    namespace VGMuse {
        namespace Frontend {
            type User = Omit<IUser, "password" | "comparePasswords" | "isStaff" | "isAdmin" | "createdAt" | "updatedAt"> & {fingerprint?: string};
        }

        type Request = ExpressRequest & {user?: Frontend.User & {isStaff?: boolean, isAdmin?: boolean}};
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
            username: string,
            email: string;
            password: string;
            isValidated: boolean;
            userType: UserType;

            isStaff: boolean;
            isAdmin: boolean;
            checkPassword: (password: string) => Promise<boolean>;
        }

        interface IUserValidation extends ISchema, ITimeStamps {
            // members

            code: string,
            user: Types.ObjectId;
            validated: boolean;

            // virtual

            isExpired: boolean;
        }

    }
}
