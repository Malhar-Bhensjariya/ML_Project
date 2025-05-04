import os
import pickle
from flask import Blueprint, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from collections import defaultdict
import itertools
import pandas as pd

recommend_bp = Blueprint('recommend_bp', __name__)

# Load the pre-trained model, vectorizer, and data from the pickle file
def load_recommender():
    file_path = os.path.join(os.path.dirname(__file__), 'course_recommender.pkl')
    with open(file_path, 'rb') as f:
        recommender_data = pickle.load(f)
    return recommender_data

# Load the components from the pickle file
recommender_data = load_recommender()
df = recommender_data['df']
vectorizer = recommender_data['vectorizer']
knn_model = recommender_data['knn']

@recommend_bp.route('/recommend', methods=['POST'])
def recommend_courses():
    data = request.get_json()
    user_skills = set(data.get("skills", []))

    if not user_skills:
        return jsonify({"error": "No skills provided"}), 400

    # === Vectorize User Skills ===
    user_skills_str = ' '.join(user_skills)
    user_vector = vectorizer.transform([user_skills_str])

    # === KNN Recommendations ===
    distances, indices = knn_model.kneighbors(user_vector)
    knn_recommendations = df.iloc[indices[0]].copy()
    knn_recommendations['source'] = 'KNN'
    knn_recommendations['distance'] = distances.flatten()  # Store distances

    # === Co-occurrence Analysis ===
    co_occur = defaultdict(lambda: defaultdict(int))
    for skills in df['skills']:
        for a, b in itertools.combinations(skills, 2):  # Fixed with combinations
            co_occur[a][b] += 1
            co_occur[b][a] += 1  # Ensure bidirectional counting

    # Find complementary skills
    skill_boost = defaultdict(int)
    for skill in user_skills:
        for related_skill, count in co_occur[skill].items():
            if related_skill not in user_skills:
                skill_boost[related_skill] += count

    # Get top complementary skills to learn
    top_skills_to_learn = [s for s, _ in sorted(skill_boost.items(),
                          key=lambda x: -x[1])[:10]]

    # === Complementary Courses ===
    df['complementary_score'] = df['skills'].apply(
        lambda x: sum(s in top_skills_to_learn for s in x)
    )
    complementary_courses = df[df['complementary_score'] > 0].copy()
    complementary_courses['source'] = 'Complementary'

    # === Combine & Rank ===
    combined = pd.concat([knn_recommendations, complementary_courses])
    combined = combined.drop_duplicates(subset=['course_title'], keep='first')

    # Create hybrid ranking score
    scaler = MinMaxScaler()
    combined['distance_norm'] = 1 - scaler.fit_transform(combined[['distance']].fillna(1))
    combined['comp_score_norm'] = scaler.fit_transform(combined[['complementary_score']])

    combined['rank_score'] = (0.7 * combined['distance_norm']) + (0.3 * combined['comp_score_norm'])
    combined = combined.sort_values(by='rank_score', ascending=False)

    # === Final Output Fields ===
    result = combined.head(5)[[  # Limit the number of recommendations
        'course_title',
        'description',
        'skills',
        'level',
        'rating',
        'num_reviews',
        'duration_hours'
    ]]
    return jsonify(result.to_dict(orient='records'))
    