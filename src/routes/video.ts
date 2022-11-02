import {Request, Response} from 'express'
import {video} from '../interfaces/video'
// Imports your configured client and any necessary S3 commands.
import {ListBucketsCommand} from "@aws-sdk/client-s3";
import {s3Client} from "../tools/s3Client";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {logger} from "../tools/logger";
import {ValidateVideoType} from "../tools/commonFuncs";

const pino = require('pino-http')();
const {DateTime} = require("luxon");

const Router = require('express-promise-router')
const db = require('../db')

const router = new Router();

router.get('/', (req: Request, res: Response) => {
    // logger.info("HTTP Request: ", pino(req, res))
    res.status(200).json({
        message: "This is the videos default endpoint"
    });
});

router.get('/:videoId', async (req: Request, res: Response) => {
    const videoId = req.params?.videoId

    const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);
    if (Object.keys(video).length == 0) {
        // logger.info({video}, 'Video is null')
        console.info({video}, 'Video is null')
    }
    res.status(200).json({
        video
    });
});

router.get('/upload', async (req: Request, res: Response) => {
    const videoId = req.params?.videoId

    const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);

    logger.info(video, "video returned");

    res.status(200).json({
        video
    });
});

router.get('/list-spaces', async (req: Request, res: Response) => {
    try {
        const data = await s3Client.send(new ListBucketsCommand({ACL: "public-read"}));
        logger.info(data, " data without accessing buckets: ")
        logger.info(data.Buckets, " Success");
        res.status(200).json(data);
    } catch (err) {
        logger.error(err, "Error");
    }
})





module.exports = router;

