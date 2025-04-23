from flask import Blueprint, request, jsonify, current_app
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
topic_recomm = Blueprint("topic_recomm", __name__)
clf = joblib.load("models/decision_tree_model_topic_recomm.pkl")
le_subject = joblib.load('models/label_encoder_subject.pkl')
le_current = joblib.load('models/label_encoder_current.pkl')
le_next = joblib.load('models/label_encoder_next.pkl')

def remove_trailing_duplicates(lst):
    if not lst:
        return lst

    last_value = lst[-1]
    while lst and lst[-1] == last_value:
        lst.pop()
    lst.append(last_value)
    return lst


@topic_recomm.route("/", methods=["POST"])
def get_topic():
    # Predict example
    data = request.get_json()
    sub = data.get("subject")
    current_topic = data.get("current_topic")
    if not current_topic or not sub:
        return jsonify("Current topic or subject cannot be None"), 400
    
    suggested_topics = []
    example = pd.DataFrame([[le_subject.transform([sub])[0], 
                        le_current.transform([current_topic])[0], 
                        75]],
                    columns=['subject_encoded', 'current_encoded', 'score'])
    c=0
    while c<10:
        pred = clf.predict(example)
        pred_topic = le_next.inverse_transform(pred)[0]
        suggested_topics.append(pred_topic)
        # print(pred, suggested_topics)
        example = pd.DataFrame([[le_subject.transform([sub])[0], 
                    pred[0], 
                    75]],
                columns=['subject_encoded', 'current_encoded', 'score'])
        c+=1
    result = remove_trailing_duplicates(suggested_topics)
    return jsonify({"response": result})