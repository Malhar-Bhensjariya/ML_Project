import React, { useEffect, useState } from 'react';
import QuestionsSection from './QuestionsSection';
import RecordAnswerSection from './RecordAnswerSection';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const MainInterview = () => {
    const { interviewId } = useParams(); 
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const NODE_API = import.meta.env.VITE_NODE_API;
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const response = await axios.get(`${NODE_API}/interview/${interviewId}`);
            const result = response.data;    
            const parsedData = JSON.parse(result.jsonMockResp);
            setMockInterviewQuestion(parsedData);
            setInterviewData(result);

            // console.log("Interview Data:", result);
            // console.log("Mock Interview:", parsedData);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };
    

    return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    {/* Mobile Layout - Completely restructured */}
    <div className="block sm:hidden">
        {/* Mobile navigation at top */}
        <div className='flex justify-between space-x-2 mb-3'>
            {activeQuestionIndex > 0 ? (
                <button 
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-full 
                    transition duration-300 ease-in-out flex-1
                    hover:bg-gray-300 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Previous
                </button>
            ) : <div className="flex-1"></div>}
            
            {activeQuestionIndex !== mockInterviewQuestion.length - 1 ? (
                <button 
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                    className="px-3 py-2 cursor-pointer bg-blue-500 text-white rounded-full 
                    transition duration-300 ease-in-out flex-1
                    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Next
                </button>
            ) : (
                <Link to={`/interview/${interviewData?._id}/feedback`} className="flex-1">
                    <button className="w-full cursor-pointer px-3 py-2 bg-green-500 text-white rounded-full 
                    transition duration-300 ease-in-out
                    hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                        End
                    </button>
                </Link>
            )}
        </div>

        {/* Compact mobile accordion-style layout */}
        <div className="space-y-3">
            {/* Question Section - Collapsible with always visible summary */}
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <details open>
                    <summary className="px-4 py-3 bg-gray-50 font-medium cursor-pointer">
                        Question {activeQuestionIndex + 1}
                    </summary>
                    <div className="p-4">
                        <QuestionsSection 
                            activeQuestionIndex={activeQuestionIndex}
                            mockInterviewQuestion={mockInterviewQuestion}
                        />
                    </div>
                </details>
            </div>
            
            {/* Record Answer Section - Always expanded and visible */}
            <div className="border rounded-lg bg-white shadow-sm p-4">
                <h3 className="font-medium mb-2">Record Your Answer</h3>
                <RecordAnswerSection
                    activeQuestionIndex={activeQuestionIndex}
                    mockInterviewQuestion={mockInterviewQuestion}
                    interviewData={interviewData}
                />
            </div>
        </div>
    </div>
    
    {/* Desktop Layout - Original side-by-side design */}
    <div className='hidden sm:block space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <QuestionsSection 
                activeQuestionIndex={activeQuestionIndex}
                mockInterviewQuestion={mockInterviewQuestion}
            />
            <RecordAnswerSection
                activeQuestionIndex={activeQuestionIndex}
                mockInterviewQuestion={mockInterviewQuestion}
                interviewData={interviewData}
            />
        </div>
        
        <div className='flex justify-end space-x-4 w-full'>
            {activeQuestionIndex > 0 && (
                <button 
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full 
                    transition duration-300 ease-in-out 
                    hover:bg-gray-300 cursor-pointer hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Previous Question
                </button>
            )}
            {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
                <button 
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                    className="px-6 py-3 cursor-pointer bg-blue-500 text-white rounded-full 
                    transition duration-300 ease-in-out 
                    hover:bg-blue-600 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Next Question
                </button>
            )}
            {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
                <Link to={`/interview/${interviewData?._id}/feedback`}>
                    <button className="cursor-pointer px-6 py-3 bg-green-500 text-white rounded-full 
                    transition duration-300 ease-in-out 
                    hover:bg-green-600 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-green-400">
                        End Interview
                    </button>
                </Link>
            )}
        </div>
    </div>
</div>
    );
};

export default MainInterview;