import boto3
import time
import random

sqs = boto3.resource('sqs', region_name="eu-central-1")
QUEUE_URL = "https://sqs.eu-central-1.amazonaws.com/862127070214/wisniewskit_tweets"

tweets = sqs.Queue(QUEUE_URL)

while True:
    for message in tweets.receive_messages(WaitTimeSeconds=10):
        time.sleep(2)
        if random.randint(0,10) <= 5:
            print('Something went wrong')
            continue
        print("Message body: {}".format(message.body))
        message.delete()
    print('next iteration.....')