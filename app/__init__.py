from flask import Flask
from config import Config
from database import db_session, init_db
from page import bp as page_bp
from api import bp as api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    init_db()

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()
    
    app.register_blueprint(page_bp)
    app.register_blueprint(api_bp)

    return app
