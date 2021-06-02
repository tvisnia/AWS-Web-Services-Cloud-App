var AWS= require('aws-sdk');

AWS.config.region = 'eu-central-1'
var sqs = new AWS.SQS();

QUEUE_URL = "https://sqs.eu-central-1.amazonaws.com/862127070214/wisniewskit_tweets"

sqs.sendMessage({
    MessageBody: 'Hello World from JS',
    QueueUrl: QUEUE_URL
}, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
})