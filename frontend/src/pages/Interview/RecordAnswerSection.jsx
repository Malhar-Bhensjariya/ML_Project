import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Mic, StopCircle } from 'lucide-react';
import useSpeechToText from 'react-hook-speech-to-text';
import axios from 'axios';
import { chatSession } from '../../configs/GeminiAiModel';
import { toast } from 'react-toastify';
import webcamImage from '../../assets/webcam.png';

const RecordAnswerSection = ({ activeQuestionIndex, mockInterviewQuestion, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;
    const {
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results?.forEach((result) => {
            setUserAnswer((prevAns) => prevAns + result?.transcript);
        });
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer?.length > 10) {
            updateUserAnswer();
        }
    }, [userAnswer]);

    const startStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const updateUserAnswer = async () => {
        try {
            setLoading(true);
            const questionText = mockInterviewQuestion[activeQuestionIndex]?.question;
            const feedbackPrompt = `Question: ${questionText}, User Answer: ${userAnswer}. Depending on the question and answer, please provide a rating and feedback (3-5 lines) in JSON format with 'rating' and 'feedback' fields.`;

            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp = result.response.text().replace('```json', '').replace('```', '');
            const jsonFeedbackResp = JSON.parse(mockJsonResp);
            console.log(jsonFeedbackResp)
            const userAnswerData = {
                mockIdRef: interviewData?._id,
                question: questionText,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: jsonFeedbackResp?.feedback,
                rating: jsonFeedbackResp?.rating,
                userId:interviewData?.user,
            };

            // Send data to backend
            const response = await axios.post(`${NODE_API}/interview/user-answer`, userAnswerData);

            if (response.status === 201) {
                toast.success('User Answer recorded successfully');
                setUserAnswer('');
                setResults([]);
            }
        } catch (error) {
            console.error('Error updating user answer:', error);
            toast.error('Failed to record answer');
        } finally {
            setResults([]);
            setLoading(false);
        }
    };

    return (
<div className="w-full p-2 sm:p-4 flex items-center justify-center flex-col space-y-3 sm:space-y-6">
    {/* Webcam container - more compact on mobile */}
    <div className="relative w-full max-w-md bg-gray-500 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
            <img 
                src={webcamImage} 
                alt="Webcam Icon" 
                className="w-1/2 h-1/2 object-contain" 
            />
        </div>
        <div className="relative z-10">
            <Webcam 
                mirrored 
                className="w-full h-[250px] sm:h-[350px] object-cover rounded-xl sm:rounded-2xl" 
            />
        </div>
    </div>

    {/* Control buttons - stacked on mobile, side by side on larger screens */}
    <div className="flex flex-col sm:flex-row items-center justify-center w-full space-y-2 sm:space-y-0 sm:space-x-4">
        <button 
            disabled={loading} 
            onClick={startStopRecording}
            className={`
                w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 
                flex items-center justify-center gap-2
                ${isRecording 
                    ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {isRecording ? (
                <>
                    <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Stop Recording
                </>
            ) : (
                <>
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    Record Answer
                </>
            )}
        </button>

        {userAnswer && !isRecording && (
            <button 
                onClick={() => {
                    setUserAnswer('');
                    setResults([]);
                }}
                className="
                    w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold 
                    bg-gray-200 text-gray-700 
                    hover:bg-gray-300 
                    transition-all duration-300 
                    flex items-center justify-center
                "
            >
                Clear Answer
            </button>
        )}
    </div>
</div>
    );
};

export default RecordAnswerSection;