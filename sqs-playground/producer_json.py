import boto3
import sys
import json

sqs = boto3.client('sqs', region_name="eu-central-1")
QUEUE_URL = "https://sqs.eu-central-1.amazonaws.com/862127070214/wisniewskit_tweets"

order_request = {
    "photos": [
        "photo1.jpeg",
        "photo2.jpeg",
    ],
    "email": "tomek97@gmail.com"
}

resp = sqs.send_message(
    QueueUrl=QUEUE_URL,
    MessageBody=json.dumps(order_request)
)

print(resp)