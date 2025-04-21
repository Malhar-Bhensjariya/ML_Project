from flask import Blueprint, jsonify, request, current_app
import requests
import time
import os
from bson.objectid import ObjectId
# Create a Blueprint for internships
coding_bp = Blueprint("coding_bp", __name__)

# API Details
API_URL = "https://judge029.p.rapidapi.com/submissions"
HEADERS = {
    "x-rapidapi-key": os.environ.get("RAPID_API"),  # Replace with your API key
    "x-rapidapi-host": "judge029.p.rapidapi.com",
    "Content-Type": "application/json"
}

source_code = "name = input()\nprint(f'Hello, {name}')"


def fetch_data(code, lang_id):        
    payload = {
        "source_code": code,
        "language_id": lang_id,  # Python 3
        "stdin": "Judge0",  # Input to program
    }

    querystring = {"base64_encoded": "false", "wait": "false", "fields": "*"}

    # Step 1: Submit Code
    response = requests.post(API_URL, json=payload, headers=HEADERS, params=querystring)
    result = response.json()

    if "token" in result:
        token = result["token"]
        print(f"Submission Token: {token}")

        # Step 2: Poll for Execution Result
        while True:
            result_response = requests.get(f"{API_URL}/{token}", headers=HEADERS, params=querystring)
            result_data = result_response.json()

            status_id = result_data.get("status", {}).get("id")
            if status_id in [1, 2]:
                print("Processing...")
                time.sleep(2)
            else:
                stdout = result_data.get("stdout", "")
                stderr = result_data.get("stderr", "")

                print("Output:", stdout)
                print("Errors:", stderr)
                return stdout, stderr
    else:
        print("Error in submission:", result)
    return

LANGUAGE_ID_MAPPING = {
    "python": 71,  # Python 3
    "python2": 4,   # Python 2
    "java": 62,     # Java
    "c": 50,        # C
    "cpp": 54,      # C++
    "javascript": 63,  # JavaScript
    "ruby": 72,     # Ruby
    "php": 59,      # PHP
    "go": 69,       # Go
    "rust": 75,     # Rust
    "typescript": 77,  # TypeScript
    "html": 53,     # HTML
    "css": 58,      # CSS
    "sql": 41,      # SQL
    "bash": 24,     # Bash
}


@coding_bp.route("/", methods=["POST"])
def get_output():
    data = request.get_json()
    code = data.get("source_code")
    lang_id = LANGUAGE_ID_MAPPING[data.get("language")]
    print(lang_id)
    stdout, stderr = fetch_data(code, lang_id)

    return jsonify({"output": stdout, "errors": stderr})

@coding_bp.route("/submit-code", methods=["POST"])
def submit_code():
    data = request.get_json()
    user_id = data.get("user_id")
    code = data.get("source_code")
    lang_id = LANGUAGE_ID_MAPPING[data.get("language")]
    stdout, stderr = fetch_data(code, lang_id)
    result = current_app.db["codes"].insert_one({"user_id": ObjectId(user_id), "output": stdout, "error": stderr, "code": code})
    if result.inserted_id:
        print("Code inserted into database")
        return jsonify("code inserted"), 201
    return jsonify("error"), 402
