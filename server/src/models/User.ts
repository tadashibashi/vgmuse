import mongoose from "mongoose";
import {hash, hashCompare} from "../utilities/hash";
const Schema = mongoose.Schema;

const emailValidator = /^\w+@\w+.\w+$/;

const userSchema = new Schema<VGMuse.IUser>({
    username: {
        type: String,
        required: [true, "username is missing"],
        unique: true,
        validate: {
            validator: async function(v: string) {
                const models = await this.constructor.find({username: v});
                return models.length === 0;
            },
            message: "This username has already been taken",
        },
    },

    email: {
        type: String,
        required: [true, "Your email address is missing"],
        unique: true,
        validate: [
            // is valid email address?
            {
                validator(v: string) {
                    return emailValidator.test(v);
                },
                message: "Please provide a valid email address",
            },
            // is unique email address?
            {
                async validator(v: string) {
                    const models = await this.constructor.find({email: v});
                    return models.length === 0;
                },
                message: "An account with your email address already exists"
            }
        ]
    },

    password: {
        type: String,
        required: true,
        validate: [
            // password is at least 8 chars
            {
                validator(v: string) {
                    return v.length >= 8;
                },
                message: "Your password must be at least 8 characters",
            },
            // password has at least one symbol, one letter, and one number
            {
                validator(v: string) {
                    return /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(v) &&
                        /[0-9]/.test(v) &&
                        /[a-zA-Z]/.test(v);
                },
                message: "Your password must contain at least one letter, number, and symbol",
            },
        ]
    },

    isValidated: {
        type: Boolean,
        required: true,
        default: false
    },

    userType: {
        type: String,
        enum: ["user", "staff", "admin"],
        default: "user"
    }

}, {
    timestamps: true,
    toJSON: {
        // Remove sensitive & unnecessary data when sending to client-side
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        },
        virtuals: false,
    },
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password"))
        return next();
    this.password = await hash(this.password);
});

userSchema.virtual("isStaff").get(function() {
    // make sure it's a validated staff member
    return this.isValidated && (this.userType === "staff" || this.userType === "admin");
});

userSchema.virtual("isAdmin").get(function() {
    return this.isValidated && (this.userType === "admin");
});

userSchema.method("checkPassword", async function(password: string) {
    return hashCompare(password, this.password);
});

export default mongoose.model("User", userSchema);
