from . import *

DEBUG = False
USE_HTTPS = True
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = [
    'mattslinks.xyz',
    '167.99.78.141',
    '127.0.0.1',
    'localhost',
]
