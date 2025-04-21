from flask import Blueprint, jsonify
from .scrape import scrape_internships 

# Create a Blueprint for internships
internship_bp = Blueprint("internship", __name__)

@internship_bp.route("/", methods=["GET"])
def get_internships():
    try:
        internships = scrape_internships()
        return jsonify({"status": "success", "data": internships}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
