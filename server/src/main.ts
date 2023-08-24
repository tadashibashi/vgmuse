import express from "express";
import * as config from "./config";
import {PORT} from "./constants";

const app = express();
config.env();
config.database();
config.email();
config.server(app);

app.listen(PORT, () => {
    console.log("VGMuse server listening at http://localhost:" + PORT);
});
