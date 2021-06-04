import S3 from 'aws-sdk/clients/s3'
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