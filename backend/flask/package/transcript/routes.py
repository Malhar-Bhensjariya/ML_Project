from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId

transcript_bp = Blueprint("transcript_bp", __name__)

import speech_recognition as sr
import requests
from moviepy.editor import VideoFileClip
from io import BytesIO
import tempfile

# Initialize recognizer
recognizer = sr.Recognizer()

# Load your MP4 file


def get_text(video_file):
    # Load your MP4 file
    # video_file = "https://res.cloudinary.com/dhk1v7s3d/video/upload/v1741483165/New_Recordings/d7ksepdunzakxnbfewre.mp4"

    # Download the video file using requests
    response = requests.get(video_file, stream=True)
    response.raise_for_status()  # Raise an exception for bad responses

    # Create a temporary file to store the video data
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:  # filter out keep-alive new chunks
                temp_file.write(chunk)
        temp_file_path = temp_file.name

    # Explicitly load the video to get duration
    video_clip = VideoFileClip(temp_file_path)

    # Check if the video has audio before extracting it
    if video_clip.audio is not None:
        audio_clip = video_clip.audio
        # Extract audio from the video file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio_file:
            audio_file_path = temp_audio_file.name
            audio_clip.write_audiofile(audio_file_path)

        # Open the extracted audio file
        with sr.AudioFile(audio_file_path) as source:
            print("Listening to audio file...")
            audio_data = recognizer.record(source)

        # Recognize the speech in the audio using Google's speech recognition
        try:
            text = recognizer.recognize_google(audio_data)
            print("Text from audio: " + text)
            return text
        except sr.UnknownValueError:
            print("Sorry, I could not understand the audio.")
        except sr.RequestError:
            print("Could not request results from Google Speech Recognition service.")
    else:
        print("The video file does not contain an audio stream.")
    
    return None


@transcript_bp.route("/", methods=["POST"])
def get_transcript():
    data = request.get_json().get("path")
    lec_id = request.get_json().get("lec_id")
    print(data)
    # video_file = "https://res.cloudinary.com/dhk1v7s3d/video/upload/v1741483165/New_Recordings/d7ksepdunzakxnbfewre.mp4"
    text = get_text(data)
    lectures = current_app.db["lectures"].update_one({'_id': ObjectId(lec_id)}, {"$set": {"transcript": text}})
    if lectures.modified_count > 0:
        print("modified the mongo db database")
    return jsonify(text)