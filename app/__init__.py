from flask import Flask
from flask_cors import CORS
from app.db import init_db, init_app
from app.routes import auth, properties, chat, api
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'supersecret'
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

    init_db()
    init_app(app)   # registers teardown so connections are closed after every request

    app.register_blueprint(auth.bp)
    app.register_blueprint(properties.bp)
    app.register_blueprint(chat.bp)
    app.register_blueprint(api.bp)

    return app
