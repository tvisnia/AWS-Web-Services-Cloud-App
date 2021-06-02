import boto3
import sys
import json
import os

REGION_FRANKFURT='eu-central-1'
NOTIFICATIONS_QUEUE_URL = os.getenv('NOTIFICATIONS_QUEUE_URL')

sqs = boto3.client('sqs', region_name=REGION_FRANKFURT)

video_ready_request = {
    "email": "tomek97@gmail.com"
    "video_url": "example/video",
}

resp = sqs.send_message(
    QueueUrl=NOTIFICATIONS_QUEUE_URL,
    MessageBody=json.dumps(video_ready_request)
)

print(resp)