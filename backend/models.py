from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise = db.Column(db.String(100), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    weight_unit = db.Column(db.String(10), nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    rpe = db.Column(db.Float, nullable=False)
    tempo = db.Column(db.String(50), nullable=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'exercise': self.exercise,
            'weight': self.weight,
            'weight_unit': self.weight_unit,
            'reps': self.reps,
            'rpe': self.rpe,
            'tempo': self.tempo,
            'date': self.date.isoformat()
        }