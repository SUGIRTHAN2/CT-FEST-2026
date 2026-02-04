# app/routes/main_routes.py
# Main Routes for CT FEST Application

from flask import Blueprint, render_template, redirect, url_for, abort
import json
import os
from types import SimpleNamespace

main_bp = Blueprint('main', __name__)

# Path to events data file
EVENTS_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'events.json')


def load_events():
    """Load events from JSON file"""
    try:
        with open(EVENTS_DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('events', [])
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading events: {e}")
        print(f"Looking for file at: {EVENTS_DATA_PATH}")
        return []


def dict_to_obj(d):
    """
    Recursively convert dictionary to object with attribute access
    This allows template to use event.field instead of event['field']
    """
    if isinstance(d, dict):
        return SimpleNamespace(**{k: dict_to_obj(v) for k, v in d.items()})
    elif isinstance(d, list):
        return [dict_to_obj(item) for item in d]
    else:
        return d


@main_bp.route('/')
def index():
    """
    Home page route
    Renders the main landing page with cinematic intro
    """
    try:
        events_list = load_events()
        print(f"Loaded {len(events_list)} events for index")
        response = render_template('index.html', events=events_list)
        print(f"Successfully rendered index.html, response length: {len(response)}")
        return response
    except Exception as e:
        print(f"Error rendering index.html: {e}")
        return f"Error: {e}", 500


@main_bp.route('/events')
def events():
    """
    Events listing page
    Shows all available events
    """
    events_list = load_events()
    return render_template('index.html', events=events_list)


@main_bp.route('/event/<int:event_id>')
def event_detail(event_id):
    """
    Individual event detail page
    Args:
        event_id: ID of the event to display
    """
    events_list = load_events()
    event_dict = next((e for e in events_list if e['event_id'] == event_id), None)
    
    if event_dict:
        # Convert dictionary to object for template attribute access
        event = dict_to_obj(event_dict)
        # Render the dedicated event detail page
        return render_template('event_detail.html', event=event)
    else:
        # Return 404 if event not found
        abort(404)


@main_bp.route('/about')
def about():
    """About page"""
    return render_template('index.html')


@main_bp.route('/contact')
def contact():
    """Contact page"""
    return render_template('index.html')


@main_bp.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('404.html'), 404


@main_bp.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors"""
    return render_template('index.html'), 500


# Register the blueprint
main = main_bp