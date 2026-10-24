"""
SafeRoute AI – Women Safety Assistant Backend
Main Flask application entry point.
"""

import os
import sys
import logging

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.api_routes import api_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("SafeRouteAI")

def create_app():
    """Application factory for Flask"""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend development and production
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(api_bp)

    # Global Error Handlers
    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({
            "success": False,
            "error": "Endpoint not found",
            "message": "The requested API endpoint does not exist. Check /api/health for available routes."
        }), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        logger.error(f"Internal Server Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing the request."
        }), 500

    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "project": "SafeRoute AI – Women Safety Assistant",
            "tagline": "Your Safety, Your Journey",
            "status": "online",
            "endpoints": [
                "/api/health",
                "/api/emergency/helplines",
                "/api/safety/tips",
                "/api/safety/categories",
                "/api/routes/geocode?q={location}",
                "/api/routes/plan (POST)",
                "/api/ai/chat (POST)"
            ]
        })

    return app

if __name__ == "__main__":
    application = create_app()
    logger.info(f"Starting SafeRoute AI Backend on http://{Config.HOST}:{Config.PORT}")
    application.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
