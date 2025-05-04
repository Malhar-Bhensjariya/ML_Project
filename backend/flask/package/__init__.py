from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # MongoDB connection
    mongo_uri = os.getenv("MONGO_URL")  # MongoDB URI from environment variable
    client = MongoClient(mongo_uri)  # Initialize MongoClient with URI
    
    # Access MongoDB database and collections
    db = client.get_database()  # This will get the default database
    app.db = db  # Add db to the app context, so you can access it in your routes

    # Register blueprints
    from package.main.routes import main_bp
    from package.project_recommendation.routes import project_recomm
    # from package.mentor_mentee.routes import mentor_mentee
    from package.internships.routes import internship_bp
    from package.users.routes import user_bp
    from package.topic_recommendation.routes import topic_recomm
    from package.genetic_algorithm.routes import genetic_bp
    from package.transcript.routes import transcript_bp
    from package.coding_workspace.routes import coding_bp
    from package.chatpdf.routes import chatpdf_bp
    from package.recommended_course.routes import recommend_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(project_recomm, url_prefix="/recommendations")
    # app.register_blueprint(mentor_mentee, url_prefix="/mentor-mentee")
    app.register_blueprint(internship_bp, url_prefix="/api/internships")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(genetic_bp, url_prefix="/genetic-algorithm")
    app.register_blueprint(transcript_bp, url_prefix="/api/transcript")
    app.register_blueprint(coding_bp, url_prefix="/api/coding")
    app.register_blueprint(chatpdf_bp, url_prefix="/api/chatpdf")
    app.register_blueprint(recommend_bp, url_prefix="/api/recommend-courses")
    app.register_blueprint(topic_recomm, url_prefix="/api/topic")

    return app
