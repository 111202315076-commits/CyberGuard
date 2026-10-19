import os
from flask import Flask
from flask_cors import CORS
from app.database import init_db

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Initialize SQLite Database
    with app.app_context():
        init_db()

    # Register Blueprints / Routes
    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app