import express from "express";
import * as config from "./config";

const app = express();
config.env();
config.database();
config.email();
config.server(app);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("VGMuse server listening at http://localhost:" + PORT);
});
