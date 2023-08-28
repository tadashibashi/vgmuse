import mongoose, {HydratedDocument} from "mongoose";
import {hash, hashCompare} from "../lib/hash";
import {enforceUnique} from "../lib/models/validation";
const Schema = mongoose.Schema;

const emailValidator = /^[\w-.]+@([\w-]+\.)+[\w-]{2,6}$/;
const usernameValidator = /^[\w-]+$/;

const userSchema = new Schema<VGMuse.IUser>({
    username: {
        type: String,
        required: [true, "username is missing"],
        minLength: [3, "Username must be at least 3 characters long"],
        unique: true,
        validate: [
            {
                validator: async function(this: HydratedDocument<VGMuse.IUser>, v: string) {
                    const ctor = this.constructor as mongoose.Model<any>;
                    const models = await ctor.find({username: v});
                    return models.length === 0 || models[0]._id.equals(this._id);
                },
                message: "This username has already been taken",
            },
            {
                validator: function (v: string) { return usernameValidator.test(v); },
                message: "Username must consist only of letters, numbers, underscores, and dashes",
            },
        ],
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
                validator: enforceUnique<VGMuse.IUser>("email"),
                message: "An account with your email address already exists"
            }
        ]
    },

    password: {
        type: String,
        required: [true, "The password field is missing"],
        minLength: [8, "Your password must be at least 8 characters"],
        validate: [
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
        default: false,
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
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret._v;
            return ret;
        },
        virtuals: false,
    },
});

// ===== Middleware ===========================================================

// pre-format values before validation
userSchema.pre("validate", function(next) {
    if (this.isModified("username"))
        this.username = this.username.trim();
    return next();
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password"))
        return next();
    this.password = await hash(this.password);
});



// ===== Getters / Setters ====================================================

userSchema.virtual("isStaff").get(function() {
    // make sure it's a validated staff member
    return this.isValidated &&
        (this.userType === "staff" || this.userType === "admin");
});

userSchema.virtual("isAdmin").get(function() {
    return this.isValidated && (this.userType === "admin");
});


// ===== Methods ==============================================================

userSchema.method("checkPassword", async function(password: string) {
    return hashCompare(password, this.password);
});


export default mongoose.model("User", userSchema);
