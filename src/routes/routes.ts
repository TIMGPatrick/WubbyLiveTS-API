import express, {Application} from "express";

const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const videoRouter = require("../routes/videos")

module.exports = function (app: Application) {
    // app.use()
    app.use("/", indexRouter);
    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);
    app.use("/video", videoRouter);
};
