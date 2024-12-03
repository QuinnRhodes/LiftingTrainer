from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from models import db, Workout

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///workouts.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Configure CORS based on environment
if os.environ.get('FLASK_ENV') == 'production':
    # In production, only allow requests from your frontend domain
    CORS(app, resources={r"/api/*": {"origins": os.environ.get('FRONTEND_URL', 'https://your-app-name.netlify.app')}})
else:
    # In development, allow all origins
    CORS(app)

# Create the database tables
def init_db():
    with app.app_context():
        db.create_all()

@app.route('/api/workouts', methods=['GET', 'POST'])
def handle_workouts():
    if request.method == 'POST':
        data = request.json
        if not data or 'exercise' not in data or 'difficulty' not in data:
            return jsonify({"error": "Invalid workout data"}), 400
        
        workout = Workout(
            exercise=data['exercise'],
            difficulty=data['difficulty']
        )
        db.session.add(workout)
        db.session.commit()
        return jsonify(workout.to_dict()), 201
    
    # GET request
    workouts = Workout.query.order_by(Workout.date.desc()).all()
    return jsonify([workout.to_dict() for workout in workouts])

@app.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    db.session.delete(workout)
    db.session.commit()
    return '', 204

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Workout Logger API is running"}), 200

if __name__ == '__main__':
    init_db()  # Initialize the database
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)