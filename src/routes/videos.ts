import express, {Request, Response} from 'express'
const Router = require('express-promise-router')

const router = new Router();

router.get('/', (req:Request, res:Response) => {
    res.status(200).json({
        message: "This is the videos default endpoint"
    });
});

router.get('/:videoId', (req:Request, res:Response) => {
    res.status(200).json({
        message: `This is the videos default endpoint with id: ${req.params.videoId}`
    });
});

module.exports = router;
