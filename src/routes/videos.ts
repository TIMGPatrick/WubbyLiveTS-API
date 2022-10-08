import {Request, Response} from 'express'
import {video} from '../interfaces/video'
const Router = require('express-promise-router')
const db = require('../db')

const router = new Router();

router.get('/', (req:Request, res:Response) => {
    res.status(200).json({
        message: "This is the videos default endpoint"
    });
});

router.get('/:videoId', async (req:Request, res:Response) => {
    const videoId = req.params?.videoId

   const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);

    console.log("video returned: ", video);

    res.status(200).json({
        video
    });
});

module.exports = router;
