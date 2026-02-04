# app/models/event.py
# Event Model for CT FEST Database

from datetime import datetime

class Event:
    """
    Event model representing a competition/workshop at CT FEST
    """
    
    def __init__(self, event_id, title, brief, description, rules, 
                 form_link, max_participants=None, team_size=None):
        self.event_id = event_id
        self.title = title
        self.brief = brief
        self.description = description
        self.rules = rules
        self.form_link = form_link
        self.max_participants = max_participants
        self.team_size = team_size
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def to_dict(self):
        """Convert event object to dictionary"""
        return {
            'event_id': self.event_id,
            'title': self.title,
            'brief': self.brief,
            'description': self.description,
            'rules': self.rules,
            'form_link': self.form_link,
            'max_participants': self.max_participants,
            'team_size': self.team_size,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def from_dict(data):
        """Create event object from dictionary"""
        return Event(
            event_id=data.get('event_id'),
            title=data.get('title'),
            brief=data.get('brief'),
            description=data.get('description'),
            rules=data.get('rules'),
            form_link=data.get('form_link'),
            max_participants=data.get('max_participants'),
            team_size=data.get('team_size')
        )
    
    def update(self, **kwargs):
        """Update event attributes"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.now()
    
    def __repr__(self):
        return f"<Event {self.event_id}: {self.title}>"


class EventRegistration:
    """
    EventRegistration model for tracking participant registrations
    """
    
    def __init__(self, registration_id, event_id, participant_name, 
                 email, phone, team_members=None):
        self.registration_id = registration_id
        self.event_id = event_id
        self.participant_name = participant_name
        self.email = email
        self.phone = phone
        self.team_members = team_members or []
        self.registered_at = datetime.now()
        self.status = 'pending'  # pending, confirmed, cancelled
    
    def to_dict(self):
        """Convert registration object to dictionary"""
        return {
            'registration_id': self.registration_id,
            'event_id': self.event_id,
            'participant_name': self.participant_name,
            'email': self.email,
            'phone': self.phone,
            'team_members': self.team_members,
            'registered_at': self.registered_at.isoformat(),
            'status': self.status
        }
    
    def confirm(self):
        """Confirm registration"""
        self.status = 'confirmed'
    
    def cancel(self):
        """Cancel registration"""
        self.status = 'cancelled'
    
    def __repr__(self):
        return f"<EventRegistration {self.registration_id}: {self.participant_name}>"