from flask import Blueprint
from app import Config

bp = Blueprint(
    'page',
    __name__, 
    url_prefix=Config.BASE_URL,
    template_folder='templates',
    static_folder='static',
    static_url_path='/static/page'
)

from . import views