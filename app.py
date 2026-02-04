import os
from website import create_app

app = create_app()

if __name__ == '__main__':
    # Get configuration
    debug = app.config.get('DEBUG', False)
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    # Run the application
    app.run(
        host=host,
        port=port,
        debug=debug,
        threaded=True
    )
