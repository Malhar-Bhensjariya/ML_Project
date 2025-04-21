from flask import Blueprint, request, jsonify, current_app
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from bson.objectid import ObjectId

mentor_mentee = Blueprint("mentor_mentee", __name__)
# Assuming you have model loaded already
model = SentenceTransformer('all-MiniLM-L6-v2')
@mentor_mentee.route("/", methods=["POST"])
def get_score():
    # collection_mentor = current_app.db['mentors']  # Replace with your collection name
    users = current_app.db['users']
    # Step 2: Fetch mentor data using mentor ObjectId
    user_id = request.get_json().get("user_id")
    user = current_app.db["users"].find_one({'_id': ObjectId(user_id)})


    # Query to find the mentor
    mentors = list(users.find({"userType": "Mentor"}))
    # print("Mentors are: ", mentors)
    mentee = user
    # print("Mentors are: ")
    # for mentor in mentors:
    #     print(mentor)
    # Convert interests/expertise into embeddings
    mentee_skills = ""
    for skill in mentee["skills"]:
        if mentee_skills != "":
            mentee_skills += ", "
        mentee_skills += skill["name"]
    mentee_texts = [mentee_skills]
    # print("Mentee text: ",mentee_texts)


    mentor_texts = []
    for mentor in mentors:
        # print(mentor["name"])
        mentor_skills = ""
        for skill in mentor["skills"]:
            if mentor_skills != "":
                mentor_skills += ", "
            mentor_skills += skill["name"]
        mentor_texts.append(mentor_skills)

    # mentor_texts = [mentor['skills'] for mentor in mentors]
    # print("Mentor text: ",mentor_texts)
    mentee_embeddings = model.encode(mentee_texts)
    mentor_embeddings = model.encode(mentor_texts)
    # print("Mentee Embeddings:", mentee_embeddings)
    # print("Mentor Embeddings:", mentor_embeddings)

    # Compute similarity scores
    similarity_matrix = cosine_similarity(mentee_embeddings, mentor_embeddings)
    # print(similarity_matrix)
    # Add similarity scores to the mentor objects
    # print("Mentors are: ", len(mentors))

    i=0
    filtered_mentors = []
    for mentor in mentors:
        filtered_mentor = {
            "_id": str(mentor["_id"]),
            "name": str(mentor["name"]),
            "email": str(mentor["email"]),
            "skills": mentor_texts[i],
            "similarity_score": float(similarity_matrix[0][i])
            # Add any other required fields here
        }
        filtered_mentors.append(filtered_mentor)
        i+=1

    # print("Filtered mentors are: ",filtered_mentors)

    sorted_mentors = sorted(filtered_mentors, key=lambda x: x['similarity_score'], reverse=True)
    # print(filtered_mentor)
    return jsonify(sorted_mentors)
@mentor_mentee.route("/team", methods=["POST"])
def get_score_from_team():
    users = current_app.db['users']
    team = request.get_json().get("team")
    
    # Find mentees with the team skill and include their id
    mentees = list(current_app.db["users"].find({'userType': "Student", 'skills.name': team}, {"_id": 1, "name": 1, "email": 1}))
    
    # Find mentors with the team skill and include their id
    mentors = list(current_app.db["users"].find({'userType': "Mentor", 'skills.name': team}, {"_id": 1, "name": 1, "email": 1}))
    
    # Print the mentees and mentors to check the data
    print("mentees are: ", mentees)
    print("mentors are: ", mentors)
    
    # Modify the result to send id as 'id' to frontend
    for mentee in mentees:
        mentee['id'] = str(mentee['_id'])  # Convert ObjectId to string and add as 'id'
        del mentee['_id']  # Remove the original '_id' field
    
    for mentor in mentors:
        mentor['id'] = str(mentor['_id'])  # Convert ObjectId to string and add as 'id'
        del mentor['_id']  # Remove the original '_id' field
    
    # Return the JSON response
    return jsonify({"Mentees": mentees, "Mentors": mentors}), 200
