import {Request, Response} from 'express'
import {video} from '../interfaces/video'
// Imports your configured client and any necessary S3 commands.
import {ListBucketsCommand} from "@aws-sdk/client-s3";
import {s3Client} from "../tools/s3Client";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {logger} from "../tools/logger";

const pino = require('pino-http')();
const {DateTime} = require("luxon");

const Router = require('express-promise-router')
const db = require('../db')

const router = new Router();

router.get('/', (req: Request, res: Response) => {
    logger.info("HTTP Request: ", pino(req,res))
    res.status(200).json({
        message: "This is the videos default endpoint"
    });
});

router.get('/:videoId', async (req: Request, res: Response) => {
    const videoId = req.params?.videoId

    const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);
    let obj = {
        firstname: "patrick",
        lastname: "mcpherson"
    }
    if (Object.keys(video).length == 0)
    {
        logger.info({video}, 'Video is null')
    }

    res.status(200).json({
        video
    });
});


router.get('/upload', async (req: Request, res: Response) => {
    const videoId = req.params?.videoId

    const video: video = await db.query('SELECT * FROM public.video where id = $1', [videoId]);

    logger.info("video returned: ", video);

    res.status(200).json({
        video
    });
});

router.get('/list-spaces', async (req: Request, res: Response) => {
    try {
        const data = await s3Client.send(new ListBucketsCommand({ACL: "public-read"}));
        logger.info("data without accessing buckets: ", data)
        logger.info("Success", data.Buckets);
        res.status(200).json(data);
    } catch (err) {
        logger.info("Error", err);
    }
})

router.post('/get-signed-url', async (req: Request, res: Response) => {
    // const data = await s3Client.send(new )
    logger.info("get-signed-url hit", req.body)
    let fileName = req.body.fileName;
    logger.info("FileName: ", fileName)
    let fileType = req.body.fileType;

    let dt = DateTime.now().setLocale("fr").toISO();
    let dtFormatted = DateTime.fromISO(dt).toFormat("yyyy/LL/dd/HH")

//  update filename (key) with this formatted datestring to add it to the folder for
//  that hour of video and then pass back the edited name so it can be put onto the file name on the front end so
//  it matches as all this should happen at once so that if the user adds the file to the system it doesn't trigger
//  until upload is actually hit
//  Specifies path, file, and content type.

    let newFileName = `${dtFormatted}/${fileName}`;
    let newFileType = fileType;

    const bucketParams = {
        Bucket: "voddle-galaxy",
        Key: newFileName,
        ContentType: "video/mp4"
    };

    try {
        const url = await getSignedUrl(s3Client, new PutObjectCommand(bucketParams), {expiresIn: 15 * 60}); // Adjustable expiration.
        logger.info("URL:", url);
        res.status(200).json({
            url: url,
            fileName: newFileName,
            fileType: newFileType,
            fileId: 'fieldId'
        })
        // logger.info(res)
        return url;
    } catch (err) {
        logger.info("Error", err);
    }
})

module.exports = router;
