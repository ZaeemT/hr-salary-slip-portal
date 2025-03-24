from flask import Flask
from flask_cors import CORS
from app.extensions import mongo, jwt
from app.config import Config
from app.routes.auth_routes import auth_bp
from app.routes.salary_routes import salary_bp
from app.routes.pdf_email_routes import process_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize CORS
    CORS(app, origins="*", supports_credentials=True)
    # @app.after_request
    # def add_cors_headers(response):
    #     response.headers["Access-Control-Allow-Origin"] = "https://hr-salary-slip-portal-4vs0.onrender.com"
    #     response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    #     response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    #     response.headers["Access-Control-Allow-Credentials"] = "true"
    #     return response
    
    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(salary_bp, url_prefix='/api/salary')
    app.register_blueprint(process_bp, url_prefix='/api/process')
    
    # Health check route
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200
    
    return app