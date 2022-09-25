import express, {Application} from "express";

const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");


// import {auth, requiredScopes} from 'express-oauth2-jwt-bearer';
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.

// const checkJwt = auth({
//     audience: process.env.CLIENTID,
//     issuerBaseURL: process.env.ISSUERBASEURL,
// });

// auth router attaches /login, /logout, and /callback routes to the baseURL
const app: Express.Application = express();


module.exports = function (app: Application) {
    app.use(express.json());
    app.use("/", indexRouter);
    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);
};
