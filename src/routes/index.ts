import express, {Request, Response} from 'express';
const Router = require('express-promise-router')

const router = new Router();

router.get(
    "/", (req: Request, res: Response) => {
        res.status(200).json({
            message: "Hello World!",
        });
    }
);

module.exports = router;


