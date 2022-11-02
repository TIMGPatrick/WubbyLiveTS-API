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

const _ = require("lodash");
const Router = require('express-promise-router')
const db = require('../db')

const router = new Router();

router.post('/video-upload-status/:videoId', async (req: Request, res: Response) => {
    // check if user id matches up and owns the requested video and whatever other verification might be needed
    // set video uploaded to true, or to false depending on if upload succeed or there was an error
    const videoId = req.params?.videoId

    const video: video = await db.query('SELECT * FROM public.video where id = $1 returning (is_uploaded)', [videoId]);

    logger.info(video, "video returned");

    res.status(200).json({
        video
    });
});

router.post('/get-signed-url', async (req: Request, res: Response) => {
    // const data = await s3Client.send(new )
    logger.info(req.body, ": get-signed-url hit")
    let fileName = req.body.fileName;
    logger.info(fileName, " FileName")
    let fileType = req.body.fileType;
    let receivedUserId: string = req.body.userId
    let user = await db.query('Select * from public.user where id = $1', [receivedUserId]).catch((data: any) => {
        logger.error(data, "Error with a user fetch")
        res.status(403).json({
            error: "Unauthorised"
        })
    })

    // populate the rest of the columns
    let userId = user.id

    let description = req.body.description ?? null;
    let tags = req.body.video_tags ?? null

    let validFileType = ValidateVideoType(fileType)

    let insertQuery = 'INSERT INTO public.video (title, description, tags, user_id) VALUES ($1, $2, $3, $4) RETURNING (*)'
    let insertParams = [fileName, description, tags, userId]
    let newVideoDetails = await db.query(insertQuery, insertParams)
    if (newVideoDetails == undefined) {
        res.status(500).json({
            error: "Server error"
        })
    }
    logger.error(newVideoDetails, ": video details")

    let fileId = newVideoDetails.id;

    let dt = DateTime.now().setLocale("fr").toISO();
    let dtFormatted = DateTime.fromISO(dt).toFormat("yyyy/LL/dd/HH")

//  update filename (key) with this formatted datestring to add it to the folder for
//  that hour of video and then pass back the edited name so it can be put onto the file name on the front end so
//  it matches as all this should happen at once so that if the user adds the file to the system it doesn't trigger
//  until upload is actually hit
//  Specifies path, file, and content type.

    let path = `${dtFormatted}/${fileId}`;
    logger.info(path)
    let newFileType = fileType;

    const bucketParams = {
        Bucket: "voddle-galaxy",
        Key: path,
        ContentType: "video/mp4"
    };

    try {
        const url = await getSignedUrl(s3Client, new PutObjectCommand(bucketParams), {expiresIn: 15 * 60}); // Adjustable expiration.
        logger.info(url, " URL");
        res.status(200).json({
            url: url,
            filePath: path,
            fileType: newFileType,
            fileId: fileId,
            fileName: newVideoDetails.title
        })
        // logger.info(res)
        return url;
    } catch (err) {
        logger.info(err, " Error");
    }
})

router.post('/initializeMultipartUpload', async (req: Request, res: Response) => {
    let path = req.body.path
    let multipartParams = {
        Bucket: process.env.DO_BUCKET,
        Key: path,
        ACL: "public-read"
    }
    const multipartUpload = await s3Client.createMultipartUpload(multipartParams)
    res.send({
        fileId: multipartUpload.UploadId,
        fileKey: multipartUpload.Key
    })
})

router.post('/getMultipartPreSignedUrls', async (req: Request, res: Response) => {
    const {fileKey, fileId, parts} = req.body
    const multipartParams = {
        Bucket: process.env.DO_BUCKET,
        Key: fileKey,
        UploadId: fileId,
        PartNumber: 0
    }
    const promises = []
    for (let index = 0; index < parts; index++) {
        promises.push(
            multipartParams.PartNumber = index + 1,
            await getSignedUrl(s3Client, new PutObjectCommand(multipartParams))
        )
    }
    const signedUrls = await Promise.all(promises)

    // each url is assigned a part to the index
    const partSignedUrlList = signedUrls.map((signedUrl, index) => {
        return {
            signedUrl: signedUrl,
            PartNumber: index + 1,
        }
    })
    res.status(200).json({
        parts: partSignedUrlList,
    })
})

router.get("/finalizeMultipartUpload",async (req: Request, res: Response) => {
    const {fileId, fileKey, parts} = req.body
    const
    multipartParams = {
        Bucket: process.env.DO_BUCKET,
        Key: fileKey,
        UploadId: fileId,
        MultipartUpload: {
// ordering the parts to make sure they are in the right order
            Parts: _.orderBy(parts, ["PartNumber"], ["asc"]),
        },
    }
    const completeMultipartUploadOutput = await s3Client.completeMultipartUpload(multipartParams)
// completeMultipartUploadOutput.Location represents the
// URL to the resource just uploaded to the cloud storage
    res.status(200).json({
        location: completeMultipartUploadOutput.Location
    })
})

module.exports = router;
