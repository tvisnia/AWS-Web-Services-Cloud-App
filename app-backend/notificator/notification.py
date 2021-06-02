import boto3
import os

REGION_FRANKFURT='eu-central-1'
SENDER = os.getenv('SENDER_EMAIL')

def notify(notificationRequest):
    if not 'email' in notificationRequest:
        raise Exception('Invalid request. Email is missing.')

    if not 'video_url' in notificationRequest:
        raise Exception('Invalid request. Email is missing.')
    
    send_email(notificationRequest['email'], notificationRequest['video_url'])


TEXT_TEMPLATE = '''
Hello,

Here is your animation download URL: {}

Best
ACME
'''

HTML_TEMPLATE = '''
<html>
    <body>
    <p><strong>Hello, </strong></p>

    <p>
    Here is your animation download URL: <a href="{}">DOWNLOAD</a>
    </p>
    <p>
    Best </br>
    ACME
    </p>
</html>
'''

def send_email(email, video_url):
    ses = boto3.client('ses', region_name=REGION_FRANKFURT)
    response = ses.send_email(
        Source=SENDER,
        Destination={
            'ToAddresses': [
                 email
            ]
    },
    Message={
        'Subject': {
            'Data': 'Your animation is ready',
            'Charset': 'utf-8'
        },
        'Body': {
            'Text': {
                'Data': TEXT_TEMPLATE.format(video_url),
                'Charset': 'utf-8'
            },
            'Html': {
                'Data': HTML_TEMPLATE.format(video_url),
                'Charset': 'utf-8'
            }
        }
    })

    print("Message sent with id: {}".format(response["MessageId"]))

if __name__ == '__main__':
    notify({
        "email": os.getenv('SENDER_EMAIL'),
        "video_url": "http://example.com/video.mp4"
    })