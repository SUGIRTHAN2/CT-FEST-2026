from flask_cors import CORS

cors = CORS()


def init_extensions(app):
    """Initialize Flask extensions"""
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"]
            }
        }
    )
