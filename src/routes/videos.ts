import {Request, Response} from 'express'
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

   const video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);

    console.log("video returned: ", video);

    res.status(200).json({
        message: `This is the videos default endpoint with id: ${req.params.videoId}`,
        result: `result of query: ${video?.hls_manifest_url}`
    });
});

module.exports = router;
