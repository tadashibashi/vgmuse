import express from "express";
import morgan from "morgan";
import router from "./routes/master";

const server = express();

server.use(morgan("dev"));
server.use(express.json());
console.log(process.cwd() + "/frontend/dist");
server.use(express.static(process.cwd() + "/../frontend/dist"));

server.use("/", router);

const PORT = 3000;
server.listen(PORT, () => {
    console.log("VGMuse server listening at http://localhost:" + PORT);
});
