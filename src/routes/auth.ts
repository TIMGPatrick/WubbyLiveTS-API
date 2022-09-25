import express, {Request, Response} from 'express'
import {auth} from "express-openid-connect";

const router = express.Router();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
};

router.use(auth(config))

// req.isAuthenticated is provided from the auth router
router.get('/', (req:any, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

module.exports = router;
