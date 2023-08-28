import {Schema, model, Error} from "mongoose";
import {enforceUnique} from "../lib/models/validation";
import slugify from "slugify";
import User from "./User";


const vgmSchema = new Schema<VGMuse.IVgm>({
    title: {
        type: String,
        required: [true, "Missing title"],
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
        type: String,
        validate: {
            validator: enforceUnique<VGMuse.IVgm>("slug", ["user"]),
            message: "A VGM you uploaded already has this url",
        },
        default: "",
    },
    isPublished: {
        type: Boolean,
        required: false,
        default: true,
    },
}, {
    timestamps: true,
});

vgmSchema.pre("save", async function() {
    // if no slug, slugify the title
     if (!this.slug) {
         this.slug = slugify(this.title);
     }
});

export default model("Vgm", vgmSchema);
