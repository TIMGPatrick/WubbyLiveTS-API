import {Request, Response} from 'express'
import {video} from '../interfaces/video'
// Imports your configured client and any necessary S3 commands.
import {ListBucketsCommand} from "@aws-sdk/client-s3";
import {s3Client} from "../tools/s3Client";

const Router = require('express-promise-router')
const db = require('../db')

const router = new Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "This is the videos default endpoint"
    });
});

// router.get('/:videoId', async (req: Request, res: Response) => {
//     const videoId = req.params?.videoId
//
//     const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);
//
//     console.log("video returned: ", video);
//
//     res.status(200).json({
//         video
//     });
// });


router.get('/upload', async (req: Request, res: Response) => {
    const videoId = req.params?.videoId

    const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);

    console.log("video returned: ", video);

    res.status(200).json({
        video
    });
});

router.get('/list-spaces', async (req: Request, res: Response) => {
    try {
        const data = await s3Client.send(new ListBucketsCommand({ACL: "public-read"}));
        console.log("data without accessing buckets: ", data)
        console.log("Success", data.Buckets);
        res.status(200).json(data);
    } catch (err) {
        console.log("Error", err);
    }
})

router.get('/get-signed-url', async (req: Request, res: Response) => {
    // const data = await s3Client.send(new )
})

module.exports = router;
