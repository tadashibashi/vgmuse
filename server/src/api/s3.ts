import {
    S3Client,
    PutObjectCommand, GetObjectCommand, DeleteObjectCommand,

} from "@aws-sdk/client-s3";
import {reqEnv} from "../lib/env";
import {StreamingBlobPayloadInputTypes} from "@smithy/types";


const BUCKET = reqEnv("S3_BUCKET");

export type UploadFile = StreamingBlobPayloadInputTypes;

let _s3: S3Client | null = null;
function getS3Client() {
    if (!_s3)
        _s3 = new S3Client({
            region: "auto",
            endpoint: reqEnv("S3_ENDPOINT"),
            credentials: {
                accessKeyId: reqEnv("S3_ACCESS_KEY"),
                secretAccessKey: reqEnv("S3_SECRET_ACCESS_KEY"),
            },
        });
    return _s3;
}

export async function uploadFile(key: string, body: UploadFile) {
    const s3 = getS3Client();

    const res = await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
    }));

    console.log(res);

    return res;
}

export async function deleteFile(key: string) {
    const s3 = getS3Client();

    const res = await s3.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
    }));

    console.log(res);

    return res;
}

export async function readFile(key: string) {
    const s3 = getS3Client();

    const res = await s3.send(new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
    }));

    return res.Body || null;
}
