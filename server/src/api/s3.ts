import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client,} from "@aws-sdk/client-s3";
import {reqEnv} from "../lib/env";
import {StreamingBlobPayloadInputTypes} from "@smithy/types";

// ========== types ==========

export type UploadFile = StreamingBlobPayloadInputTypes;

// ========== constants ==========

const BUCKET = reqEnv("S3_BUCKET");



// ========== api ==========

export async function uploadFile(key: string, body: UploadFile) {
    const s3 = getS3Client();

    return await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
    }));
}

/**
 * Delete a file from s3
 * @param key
 */
export async function deleteFile(key: string) {
    const s3 = getS3Client();

    const res = await s3.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
    }));

    console.log(res);

    return res;
}

/**
 * Returns a byte array from file uploaded to s3, or
 * null if it could not be found, or there was an error
 *
 * @param key
 */
export async function readFile(key: string) {
    const s3 = getS3Client();

    const res = await s3.send(new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
    }));

    return res.Body ? res.Body.transformToByteArray() : null;
}


// ========== helpers ==========

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