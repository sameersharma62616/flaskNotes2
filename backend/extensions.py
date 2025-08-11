from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import cloudinary
from config import Config

mongo = PyMongo()
jwt = JWTManager()

def init_extensions(app):
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=Config.FRONTEND_URL, supports_credentials=True)

    cloudinary.config(
        cloud_name=Config.CLOUDINARY_CLOUD_NAME,
        api_key=Config.CLOUDINARY_API_KEY,
        api_secret=Config.CLOUDINARY_API_SECRET,
        secure=True
    )