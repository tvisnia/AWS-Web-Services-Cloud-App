import boto3

from pprint import pprint as pp

s3 = boto3.resource('s3')
buckets = [bucket for bucket in s3.buckets.all()]
pp(buckets)