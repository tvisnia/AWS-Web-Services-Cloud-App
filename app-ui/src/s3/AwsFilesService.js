import S3 from 'aws-sdk/clients/s3'
import { v4 as uuid } from 'uuid'
import { awsConfig } from '../aws_exports'
import { MAX_KEYS_TO_FETCH } from './commons/Const'

export const listFiles = () => {
    const s3 = new S3()

    return new Promise((resolve, reject) => {
        s3.listObjectsV2({
            Bucket: awsConfig.bucketName,
            MaxKeys: MAX_KEYS_TO_FETCH
        }, (err, data) => {
            if (err) reject(err)
            resolve(data.Contents.map(item => ({ name: item.Key, size: item.Size })))
        })
    })
}

export const uploadToS3 = (userId, file, onProgress) => {
    return new Promise((resolve, reject) => {
        const destKey = `uek-krakow/${userId}/images/${uuid()}/${file.name}`;
        const params = {
            Body: file,
            Bucket: awsConfig.bucketName,
            Key: destKey,
        }

        const s3 = new S3();

        s3.putObject(params, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(destKey);
        }).on('httpUploadProgress', (progress) => {
            const currentProgress = Math.round((progress.loaded / progress.total) * 100);
            onProgress(currentProgress);
            console.log(`current progres is: ${currentProgress}%`);
        })
    });
}

export const getPresigendUrl = (key) => {
    const params = {
        Bucket: awsConfig.bucketName,
        Key: key
    }

    const s3 = new S3();

    return s3.getSignedUrl('getObject', params);
}