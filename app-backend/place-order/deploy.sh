##!/bin/bash
APP_BUCKET="${APP_BUCKET:-wisniewskit}"
FUNCTION_NAME="${FUNCTION_NAME:-wisniewskit-wpc2-place-order}"
REGION_FRANKFURT=eu-central-1

## build
rm lambda.zip || true

zip -r lambda.zip ./* \
    --exclude 'lambda.zip' \
    --exclude 'deploy.sh'

## release
 aws s3 cp ./lambda.zip s3://${APP_BUCKET}/code/${FUNCTION_NAME}/lambda.zip

## update code
aws lambda update-function-code --function-name ${FUNCTION_NAME} --s3-bucket ${APP_BUCKET} --s3-key code/${FUNCTION_NAME}/lambda.zip --publish --region ${REGION_FRANKFURT}
