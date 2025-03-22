from flask import Flask
from app.extensions import mongo
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    mongo.init_app(app)
    
    # Register blueprints
    
    # Health check route
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200
    
    return app