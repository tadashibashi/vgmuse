import mongoose from "mongoose";
import {reqEnv} from "../lib/env";

function config() {
    mongoose.connect(reqEnv("DATABASE_URI")).then(() => {
        console.log("Connected to database: " + mongoose.connection.host);
    });
}

export default config;
