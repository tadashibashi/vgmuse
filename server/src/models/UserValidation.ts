import mongoose, {Schema, Types, model} from "mongoose";
import {ISchema, ITimeStamps} from "./types";

// Icebox feature:
// 0. User signs up
// 1. Log user in, generate token
// 2. We request a new UserValidation and generate code for that user, expires in 15 minutes.
// 3. An email will be sent to the user's email with the code and expiration date with link to validation page.
//  - Front-end page will be at /user/validate/:validationId
//  - Our api path will be /api/user/validate/:validationId GET / POST
// 4. Successful code entry will set user's isValidated member to true, update model
// 5. Delete user validation

// Every once in a while, perhaps on server startup we can clean the database of expired
// validations

interface IUserValidation extends ISchema, ITimeStamps {
    // members

    code: string,
    user: Types.ObjectId;
    validated: boolean;

    // virtual

    isExpired: boolean;
}

const EXPIRATION_MINUTES = 15;

const userValidationSchema = new Schema<IUserValidation>({
    code: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                const num = parseInt(v);
                return !isNaN(num);
            },
            message: "code must be a string of integers"
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    validated: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

userValidationSchema.virtual("isExpired")
    .get(function() {
        return (Date.now() - this.createdAt.valueOf()) / 1000 / 60 >= EXPIRATION_MINUTES;
    });

export default model("UserValidation", userValidationSchema);
