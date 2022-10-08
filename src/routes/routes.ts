import {Application} from "express";
const cors = require('cors')


const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const videoRouter = require("../routes/videos")

module.exports = function (app: Application) {
    // app.use()
    app.use(cors());

    app.use("/api/v1", indexRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/p", profileRouter);
    app.use("/api/v1/v", videoRouter);
};
