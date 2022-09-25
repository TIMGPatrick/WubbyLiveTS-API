import express, {Request, Response} from 'express'
import {requiresAuth} from "express-openid-connect";

const router = express.Router();

router.get('/', (req: Request,res:Response):Response => {
    return res.status(200).send({
        message: "This is the non protected profile page"
    })
})

router.get('/test', requiresAuth() ,(req: Request,res:Response):Response => {
    return res.status(200).send(JSON.stringify(req.oidc.user))
})

module.exports = router;
