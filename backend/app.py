from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from models import db, Workout
import traceback

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///workouts.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Configure CORS based on environment
if os.environ.get('FLASK_ENV') == 'production':
    # In production, only allow requests from your frontend domain
    CORS(app, resources={r"/api/*": {"origins": ["https://quinnrhodes.github.io"]}})
else:
    # In development, allow all origins
    CORS(app)

# Predefined exercises list
EXERCISES = [
    "Competition Squat",
    "Competition Bench",
    "Competition Deadlift",
    "Leg Press",
    "One Arm Tricep Pushdown",
    "Two Arm Tricep Pushdown",
    "Preacher Curl",
    "Wide Grip Cable Row",
    "Leg Curl",
    "Leg Extension",
    "Katana Extension",
    "Close Grip Larsen Press",
    "Competition Grip Larsen Press",
    "Cable Curl",
    "Weighted GHD Extension",
    "Reverse Hyper",
    "Close Grip Cable Row",
    "One Arm Lat Pulldown",
    "Romanian Deadlift",
    "Squat High Bar",
    "Pause Deadlift"
]

# Create the database tables
def init_db():
    with app.app_context():
        db.create_all()

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    return jsonify(EXERCISES)

@app.route('/api/workouts', methods=['GET', 'POST'])
def handle_workouts():
    try:
        if request.method == 'POST':
            data = request.json
            required_fields = ['exercise', 'weight', 'weight_unit', 'reps', 'rpe', 'tempo']
            if not data or not all(field in data for field in required_fields):
                missing_fields = [field for field in required_fields if field not in data]
                return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
            
            # Handle custom exercise
            exercise = data.get('customExercise') if data.get('exercise') == 'Custom' else data.get('exercise')
            
            workout = Workout(
                exercise=exercise,
                weight=float(data['weight']),
                weight_unit=data['weight_unit'],
                reps=int(data['reps']),
                rpe=float(data['rpe']),
                tempo=data['tempo']
            )
            db.session.add(workout)
            db.session.commit()
            return jsonify(workout.to_dict()), 201
        
        # GET request
        workouts = Workout.query.order_by(Workout.date.desc()).all()
        return jsonify([workout.to_dict() for workout in workouts])
    except Exception as e:
        print("Error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    try:
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return '', 204
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Workout Logger API is running"}), 200

# Initialize the database when the app starts
init_db()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)