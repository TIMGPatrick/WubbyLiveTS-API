import express, {Application} from "express";

var indexRouter = require("../routes/index");
var authRouter = require("../routes/auth");
var profileRouter = require("../routes/profile");

const app: Express.Application = express();

module.exports = function(app: Application) {
    app.use(express.json());

    app.use("/", indexRouter);
    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);
};
