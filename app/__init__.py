from flask import Flask 
from app.db import init_db
from app.routes import auth, properties, chat , admin
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'supersecret'

    # Correct path to uploads inside app/static/uploads
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')

    # Create the uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    print("Upload folder:", app.config['UPLOAD_FOLDER'])

    init_db()

    app.register_blueprint(auth.bp)
    app.register_blueprint(properties.bp)
    app.register_blueprint(chat.bp)
    app.register_blueprint(admin.bp)
    


    return app


