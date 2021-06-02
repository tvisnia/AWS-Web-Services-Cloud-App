import boto3

s3 = boto3.resource('s3')
MY_BUCKET = "wisniewskit"
with open('bear.txt', 'rb') as my_file:

bucket = s3.Bucket(MY_BUCKET)
bucket.putObject(Key="arts/asci/bear.txt", Body=my_file)