import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import axios from 'axios';

const StartInterview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const response = await axios.get(`${NODE_API}/interview/${interviewId}`);
            setInterviewData(response.data);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };

    return (
        <div className='container mx-auto px-4 py-6 sm:my-10'>
            <h2 className='font-bold text-xl sm:text-2xl mb-4 sm:mb-6'>Let's Get Started</h2>
            
            {/* Stack everything vertically on mobile */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-10'>
                {/* Job info and instructions section */}
                <div className='flex flex-col gap-4 sm:gap-5'>
                    <div className='flex flex-col p-4 sm:p-5 rounded-lg border border-gray-300'>
                        <h2 className='text-base sm:text-lg mb-2'>
                            <strong>Job Role/Job Position: </strong>
                            {interviewData?.jobPosition}
                        </h2>
                        <h2 className='text-base sm:text-lg mb-2'>
                            <strong>Job Description/Tech Stack: </strong>
                            {interviewData?.jobDesc}
                        </h2>
                        <h2 className='text-base sm:text-lg'>
                            <strong>Years Of Experience: </strong>
                            {interviewData?.jobExperience}
                        </h2>
                    </div>
                    
                    <div className='p-4 sm:p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-600 mb-2 sm:mb-3'>
                            <Lightbulb className='text-yellow-500 w-5 h-5' />
                            <strong>Information</strong>
                        </h2>
                        <p className='text-sm sm:text-base text-yellow-600'>
                            Enable Video Web Cam and Microphone to start your AI Generated Mock Interview. 
                            You will be given 5 questions which you will have to answer based on your tech stack. 
                            In the end, you will get a report based on your answers.
                        </p>
                    </div>
                </div>
                
                {/* Webcam section */}
                <div className='mt-2 md:mt-0'>
                    {webCamEnabled ? (
                        <div className='flex justify-center md:justify-start'>
                            <Webcam
                                onUserMedia={() => setWebCamEnabled(true)}
                                onUserMediaError={() => setWebCamEnabled(false)}
                                mirrored={true}
                                className='rounded-lg w-full max-w-[300px] h-auto aspect-video object-cover'
                            />
                        </div>
                    ) : (
                        <div>
                            <WebcamIcon className='h-48 sm:h-72 w-full p-10 sm:p-20 bg-gray-100 rounded-lg border' />
                            <button 
                                className='w-full px-4 py-2 mt-3 bg-blue-600 text-white rounded-lg 
                                          hover:bg-blue-700 transition-colors focus:outline-none 
                                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                onClick={() => setWebCamEnabled(true)}
                            >
                                Enable Web Cam and Microphone
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Fixed button at bottom on mobile */}
            <div className='fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg md:shadow-none md:static md:bg-transparent md:flex md:justify-end md:mt-4 md:p-0'>
                <button 
                    className='w-full md:w-auto px-6 py-3 md:py-2 bg-blue-600 text-white rounded-lg 
                              hover:bg-blue-700 transition-colors focus:outline-none 
                              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    onClick={() => navigate(`/interview/${interviewId}/start`)}
                >
                    Start Interview
                </button>
            </div>
            
            {/* Add padding to prevent overlap with fixed button on mobile */}
            <div className='h-16 md:h-0'></div>
        </div>
    );
};

export default StartInterview;