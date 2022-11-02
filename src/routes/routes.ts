import express, {Application} from "express";
import pinoHTTP from "pino-http";
import {logger} from "../tools/logger";

const cors = require('cors')


const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const videoRouter = require("./video")
const uploadRouter = require("./upload")

module.exports = function (app: Application) {
    app.use(express.json());
    app.use(cors());
    app.use("/api/v1", indexRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/p", profileRouter);
    app.use("/api/v1/v", videoRouter);
    app.use("/api/v1/v/upload", uploadRouter);
};
