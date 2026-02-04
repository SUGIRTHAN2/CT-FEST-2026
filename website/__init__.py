import os
from flask import Flask
from .config import get_config
from .extensions import init_extensions
from .app.routes import main_bp, api_bp
import click

def create_app(config_name=None):
    """
    Application factory function
    Creates and configures the Flask application
    """
    # Determine absolute paths for template and static folders
    base_dir = os.path.abspath(os.path.dirname(__file__))
    template_dir = os.path.join(base_dir, 'templates')
    static_dir = os.path.join(base_dir, 'static')

    app = Flask(
        __name__,
        template_folder=template_dir,
        static_folder=static_dir
    )

    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    config_class = get_config(config_name)
    app.config.from_object(config_class)
    
    # Initialize extensions
    init_extensions(app)
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register CLI commands
    register_commands(app)
    
    return app

def register_error_handlers(app):
    """Register error handlers"""
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500

def register_commands(app):
    """Register custom CLI commands"""
    @app.cli.command()
    def init_db():
        """Initialize the database"""
        click.echo('Initializing database...')
        # Add database initialization logic here
        click.echo('Database initialized!')
    
    @app.cli.command()
    def seed_data():
        """Seed the database with sample data"""
        click.echo('Seeding database...')
        # Add data seeding logic here
        click.echo('Database seeded!')
