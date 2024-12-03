import os
from app import app as application

# Set production environment
os.environ['FLASK_ENV'] = 'production'
# Allow requests from GitHub Pages
os.environ['FRONTEND_URL'] = 'https://QuinnRhodes.github.io'

if __name__ == '__main__':
    application.run()