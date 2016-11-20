class Config(object):
    # Built in
    DEBUG = True

    # Web
    BASE_URL = '/links' if DEBUG else ''

    # Database
    DB_USER     = 'root'
    DB_HOST     = 'localhost'
    DB_PASSWORD = ''
    DB_NAME     = 'links'