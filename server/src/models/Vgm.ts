import {Schema, model} from "mongoose";
import {enforceUnique} from "../lib/models/validation";

const vgmSchema = new Schema<VGMuse.IVgm>({
    title: {
        type: String,
        required: true,
        validate: {
            validator: enforceUnique<VGMuse.IVgm>("title", ["user"]),
            message: "A VGM you uploaded already has this title",
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Missing user id"],
    },
    fileKey: String,
    slug: {
        required: true,
        type: String,
        validate: {
            validator: enforceUnique<VGMuse.IVgm>("slug", ["user"]),
            message: "A VGM you uploaded already has this url",
        },
    },
    isPublished: {
        type: Boolean,
        required: false,
        default: false,
    },
}, {
    timestamps: true,
});

export default model("Vgm", vgmSchema);
