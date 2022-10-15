// Imports your configured client and any necessary S3 commands.
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3Client} from "../tools/s3Client";

// Generates the URL.
async function GenerateSignedUrl(fileName: string, fileType: string): Promise<string | undefined> {
    // Specifies path, file, and content type.
    let spaceParams = {
        Bucket: "voddle-galaxy",
        Key: fileName,
        ContentType: fileType,
        ACL: 'public-read'
    };
    try {
        const url = await getSignedUrl(s3Client, new PutObjectCommand(spaceParams), {expiresIn: 15 * 60}); // Adjustable expiration.
        console.log("URL:", url);
        return url;
    } catch (err) {
        console.log("Error", err);
    }
}

export {GenerateSignedUrl};
