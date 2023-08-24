import express from "express";
import * as config from "./config";
import {getEnv} from "./lib/env";

const app = express();
config.env();
config.database();
config.email();
config.server(app);

const PORT = getEnv("PORT") || 3000;

app.listen(PORT, () => {
    console.log("VGMuse server listening at http://localhost:" + PORT);
});
