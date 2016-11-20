from flask import Blueprint
from app import Config

bp = Blueprint(
    'api',
    __name__,
    url_prefix=Config.BASE_URL+'/api'
)

from controllers import link_controller
from controllers import user_controller
