// Imports your configured client and any necessary S3 commands.
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3Client} from "../tools/s3Client";
import {logger} from "../tools/logger";

// Generates the URL.
async function GenerateSignedUrl(fileName: string, fileType: string): Promise<string | undefined> {
    // Specifies path, file, and content type.
    let spaceParams = {
        Bucket: process.env.DO_BUCKET,
        Key: fileName,
        ContentType: fileType,
        ACL: 'public-read'
    };
    try {
        const url = await getSignedUrl(s3Client, new PutObjectCommand(spaceParams), {expiresIn: 15 * 60}); // Adjustable expiration.
        logger.info("URL:", url);
        return url;
    } catch (err) {
        logger.info("Error", err);
    }
}

export {GenerateSignedUrl};
