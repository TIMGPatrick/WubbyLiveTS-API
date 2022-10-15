import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
    endpoint: process.env.DO_ENDPOINT,
    region: process.env.DO_REGION,
    credentials: <any> {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET_KEY
    }
});

export { s3Client };
