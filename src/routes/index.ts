import express, {Request, Response } from 'express';
import {auth} from 'express-openid-connect';

const router = express.Router();

router.get(
    "/", (req: Request, res: Response) => {
        res.status(200).send({
            message: "Hello World!",
        });
    }
);

router.get("/callback", (req:any,res) => {
    res.status(200).send({
        message: req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
    })
})

module.exports = router;


