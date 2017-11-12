"""
Upload a database backup file to AWS S3
"""
from __future__ import print_function
import os
import argparse

import boto3

BUCKET_NAME = 'links-db-backup'
s3 = boto3.resource('s3').Bucket(BUCKET_NAME)


def upload(filename):
    if not os.path.isfile(filename):
        raise ValueError('Argument must be a file')

    print('Uploading {} to S3... '.format(filename), end='')
    s3.upload_file(filename, filename)
    print('done.')


def download_latest():
    latest = None
    for obj in s3.objects.all():
        if not latest or obj.last_modified > latest.last_modified:
            latest = obj
    key = latest.key
    s3.download_file(key, key)
    print(key)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Upload/download database backups')
    parser.add_argument('action', choices=['upload', 'download'])
    parser.add_argument('--filename', help='File name for upload')
    args = parser.parse_args()

    if args.action == 'upload':
        assert args.filename, 'Upload option must come with a filename'
        upload(args.filename)
    else:
        download_latest()
