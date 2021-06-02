import boto3

s3 = boto3.resource('s3')
MY_BUCKET = "wisniewskit"
bucket = s3.Bucket(MY_BUCKET)
obj = bucket.Object('mountains_ascii.txt')

with open('downloaded_mountains_ascii.txt', 'wb') as data:
    obj.download_fileobj(data)