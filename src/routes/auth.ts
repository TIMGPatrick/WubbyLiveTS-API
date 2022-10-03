import express, {Request, Response} from 'express'

const Router = require('express-promise-router')

const router = new Router();

router.get('/', (req: Request, res: Response) => {
    res.send({
        message: "this is the auth endpoint"
    });
});

module.exports = router;
