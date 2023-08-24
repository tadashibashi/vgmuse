import mongoose from "mongoose";
import {User} from "../../models";

export async function deleteUser(id: string | mongoose.Types.ObjectId) {
    const user = await User.findById(id);
    if (!user) return false;

    // delete VGM, comments, likes here

    await user.deleteOne();
    return true;
}

export async function deleteVgm(id: string | mongoose.Types.ObjectId) {

}