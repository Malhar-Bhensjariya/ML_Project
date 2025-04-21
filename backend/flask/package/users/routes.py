from flask import Blueprint, request, jsonify, current_app
user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/all-mentees")
def get_all_mentees():
    mentees = list(current_app.db["users"].find({"userType": "Student"},  {"name": 1, "skills.name": 1}))
    for m in mentees:
        m["_id"] = str(m["_id"])
    return jsonify({"mentees": mentees})