import os
from dotenv import load_dotenv 

# Load environment variables from .env file
load_dotenv()

class Config:
    # MongoDB settings
    MONGO_URI = os.environ.get('MONGO_URI')

    # Secret key for JWT and other security
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    
    # File upload settings
    UPLOAD_FOLDER = 'tmp/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload size
    ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv'}
    
    # PDF Generation settings
    PDF_FOLDER = 'tmp/generated_pdfs'
    
    # Email settings
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') == 'True'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
    
    # CORS settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Ensure required directories exist
    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, mode=0o777, exist_ok=True)
        os.makedirs(Config.PDF_FOLDER, mode=0o777, exist_ok=True)