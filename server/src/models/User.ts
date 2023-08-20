import mongoose from "mongoose";
const Schema = mongoose.Schema;

const emailValidator = /^\w+@\w+.\w+$/;

const userSchema = new Schema<VGMuse.IUser>({
    username: { type: String, required: [true, "username is missing"], unique: true },
    email: { type: String, required: [true, "email is missing"], unique: true, validate: {
        validator: function(v: string) {
            return emailValidator.test(v);
        },
        message: "must be a valid email",
    }},

    password: {
        type: String,
        required: true
    },
    isValidated: { type: Boolean, required: true, default: false },

    userType: { type: String, enum: ["user", "staff", "admin"], default: "user"}
}, {
    timestamps: true,
    toJSON: {
        // Remove sensitive & unnecessary data when sending to client-side
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.isValidated;
            return ret;
        }
    }
});

userSchema.virtual("isStaff").get(function() {
    // make sure it's a validated staff member
    return this.isValidated && (this.userType === "staff" || this.userType === "admin");
});

userSchema.virtual("isAdmin").get(function() {
    return this.isValidated && (this.userType === "admin");
});

export default mongoose.model("User", userSchema);
