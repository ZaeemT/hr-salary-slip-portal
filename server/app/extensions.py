from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager

# MongoDB extension
mongo = PyMongo()

# JWT extension
jwt = JWTManager()