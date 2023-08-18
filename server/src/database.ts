import mongoose from "mongoose";
import {reqEnv} from "./env";

function config() {
    mongoose.connect(reqEnv("DATABASE_URI")).then(() => {
        console.log("Connected to database.");
    });
}

export default {
    config,
};
