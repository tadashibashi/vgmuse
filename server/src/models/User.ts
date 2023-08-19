import mongoose from "mongoose";
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true
    },
    isValidated: { type: Boolean, required: true, default: false },

    userType: { enum: ["user", "staff", "admin"]}
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

export default mongoose.model("User", userSchema);
