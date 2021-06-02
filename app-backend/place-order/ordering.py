import boto3
import json

REGION_FRANKFURT="eu-central-1"

def place_order(queue_url, order_request):
    sqs = boto3.resource('sqs', region_name=REGION_FRANKFURT)
    queue = sqs.Queue(queue_url)
    queue.send_message(
        MessageBody=json.dumps(order_request)
    )
