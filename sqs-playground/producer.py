import boto3
import sys

sqs = boto3.client('sqs', region_name="eu-central-1")

QUEUE_URL = "https://sqs.eu-central-1.amazonaws.com/862127070214/wisniewskit_tweets"

resp = sqs.send_message(
    QueueUrl=QUEUE_URL,
    MessageBody=sys.argv[1]
)

print(resp)