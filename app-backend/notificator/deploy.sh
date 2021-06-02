##!/bin/bash
BUCKET_NAME="${BUCKET_NAME:-wisniewskit}"
FUNCTION_NAME="${FUNCTION_NAME:-wisniewskit_notify}"
REGION_FRANKFURT=eu-central-1

## build
rm lambda.zip || true

zip -r lambda.zip ./* \
    --exclude 'lambda.zip' \
    --exclude 'deploy.sh'

## release
 aws s3 cp ./lambda.zip s3://${BUCKET_NAME}/code/${FUNCTION_NAME}/lambda.zip

## update code
aws lambda update-function-code --function-name ${FUNCTION_NAME} --s3-bucket ${BUCKET_NAME} --s3-key code/${FUNCTION_NAME}/lambda.zip --publish --region ${REGION_FRANKFURT}
