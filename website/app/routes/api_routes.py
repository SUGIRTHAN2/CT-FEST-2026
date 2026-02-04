# app/routes/api_routes.py
# API Routes for CT FEST Application

from flask import Blueprint, jsonify, request
import json
import os

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Path to events data file
EVENTS_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'events.json')


def load_events():
    """Load events from JSON file"""
    try:
        with open(EVENTS_DATA_PATH, 'r') as f:
            data = json.load(f)
            return data.get('events', [])
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []


@api_bp.route('/events', methods=['GET'])
def get_events():
    """
    Get all events
    Returns: JSON array of all events
    """
    try:
        events = load_events()
        return jsonify({
            'success': True,
            'data': events,
            'count': len(events)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """
    Get a specific event by ID
    Args:
        event_id: Integer ID of the event
    Returns: JSON object of the event
    """
    try:
        events = load_events()
        event = next((e for e in events if e['event_id'] == event_id), None)
        
        if event:
            return jsonify({
                'success': True,
                'data': event
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Event not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/events/search', methods=['GET'])
def search_events():
    """
    Search events by title or brief
    Query params:
        q: Search query string
    Returns: JSON array of matching events
    """
    try:
        query = request.args.get('q', '').lower()
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query is required'
            }), 400
        
        events = load_events()
        results = [
            e for e in events 
            if query in e['title'].lower() or query in e['brief'].lower()
        ]
        
        return jsonify({
            'success': True,
            'data': results,
            'count': len(results)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/register', methods=['POST'])
def register_participant():
    """
    Register a participant for an event
    Body: JSON with participant details
    Returns: Registration confirmation
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['event_id', 'name', 'email', 'phone']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Check if event exists
        events = load_events()
        event = next((e for e in events if e['event_id'] == data['event_id']), None)
        
        if not event:
            return jsonify({
                'success': False,
                'error': 'Event not found'
            }), 404
        
        # Here you would typically save to database
        # For now, we'll just return success
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'data': {
                'event_title': event['title'],
                'participant_name': data['name'],
                'email': data['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Get festival statistics
    Returns: JSON object with stats
    """
    try:
        events = load_events()
        
        total_capacity = sum(e.get('max_participants', 0) for e in events)
        
        stats = {
            'total_events': len(events),
            'total_capacity': total_capacity,
            'event_types': {
                'competitions': 4,
                'workshops': 1,
                'tournaments': 1
            }
        }
        
        return jsonify({
            'success': True,
            'data': stats
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404


@api_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

api = api_bp