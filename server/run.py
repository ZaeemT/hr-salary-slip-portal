from app import create_app
from app.config import Config

# Create Flask application
app = create_app(Config)

if __name__ == '__main__':
    # Initialize required directories
    Config.init_app(app)
    # Run the Flask app
    app.run(debug=True)