from __future__ import print_function
import os
import sys
import boto3

BUCKET_NAME = 'links-db-backup'
s3_client = boto3.client('s3')


def upload(filename):
    if not os.path.isfile(filename):
        raise ValueError('Argument must be a file')

    print('Uploading {} to S3... '.format(filename), end='')
    s3_client.upload_file(filename, BUCKET_NAME, filename)
    print('done.')


if __name__ == '__main__':
    filename = sys.argv[1]
    upload(filename)
