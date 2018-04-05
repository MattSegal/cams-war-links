#!/bin/bash
echo "Starting links app as `whoami`"

echo "Running migrations"
./manage.py migrate

echo "Collecting static files (background job)"
./manage.py collectstatic --noinput &

mkdir -p /var/log/gunicorn

echo "Starting gunicorn"
gunicorn links.wsgi:application \
  --name links \
  --workers 3 \
  --bind 0.0.0.0:8001 \
  --capture-output \
  --log-level info \
  --error-logfile /var/log/gunicorn/error.log \
  --access-logfile /var/log/gunicorn/access.log
