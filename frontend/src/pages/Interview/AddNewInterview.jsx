import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, LoaderCircle, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AddNewInterview = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobPos, setJobPos] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExp, setJobExp] = useState('');
    const [loading, setLoading] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${NODE_API}/interview/generate-interview`, {
                jobPos, 
                jobDesc, 
                jobExp, 
                userId: user?._id,  
            });

            console.log('Interview generated:', response.data);
            const interviewId = response.data.interview._id;
            navigate(`/interview/${interviewId}`);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error generating interview:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 sm:p-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center sm:text-2xl sm:mb-6">
                    <Sparkles className="mr-4 text-indigo-600 sm:mr-2 sm:w-5 sm:h-5" />
                    Create Your AI Interview Companion
                </h2>
    
                <div 
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div 
                        className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 
                                   flex flex-col items-center justify-center 
                                   hover:from-indigo-100 hover:to-blue-100 transition-all group
                                   sm:p-6"
                    >
                        <PlusCircle 
                            className="w-16 h-16 text-indigo-600 mb-4 
                                       group-hover:scale-110 transition-transform
                                       sm:w-12 sm:h-12 sm:mb-3"
                        />
                        <p className="text-xl font-semibold text-gray-800 text-center sm:text-lg">
                            Start a New AI-Powered Interview
                        </p>
                    </div>
                </div>
    
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer sm:p-4" 
                         onClick={(e) => {
                             if (e.target === e.currentTarget) setIsModalOpen(false);
                         }}
                    >
                        <div 
                            className="bg-white md:w-[600px] md:rounded-3xl shadow-2xl border-2 border-indigo-100 
                                        animate-fade-in-up transform transition-all duration-300 
                                        hover:shadow-3xl overflow-hidden cursor-default
                                        w-5/6 h-11/12 overflow-y-auto sm:max-w-full sm:rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 sm:p-4">
                                <h3 className="md:text-2xl font-bold text-white flex items-center sm:text-xl">
                                    <Sparkles className="mr-3 sm:mr-2 sm:w-5 sm:h-5" />
                                    Interview Preparation Wizard
                                </h3>
                            </div>
                            
                            <form onSubmit={onSubmit} className="p-8 md:space-y-6 space-y-3 sm:p-4 sm:space-y-4">
                                <div>
                                    <p className="mb-2 text-md font-medium text-gray-700 sm:mb-1">
                                        Job Position
                                    </p>
                                    <input 
                                        type="text"
                                        placeholder="e.g., Senior Software Engineer"
                                        required
                                        className="w-full text-sm md:text-base md:p-4 p-2 border-2 border-gray-200 md:rounded-xl 
                                                   focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                                                   transition-all duration-300 
                                                   hover:border-indigo-300
                                                   sm:p-3 sm:rounded-lg md:placeholder:text-base placeholder:text-xs"
                                        value={jobPos}
                                        onChange={(e) => setJobPos(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <p className="text-md  mb-2 text-sm font-medium text-gray-700 sm:mb-1">
                                        Job Description & Tech Stack
                                    </p>
                                    <textarea 
                                        placeholder="e.g., React, Node.js, AWS, GraphQL"
                                        required
                                        rows={3}
                                        className="w-full p-4 text-sm md:text-base border-2 border-gray-200 md:rounded-xl 
                                                   focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                                                   transition-all duration-300 
                                                   hover:border-indigo-300 resize-none
                                                   sm:p-3 sm:rounded-lg  md:placeholder:text-base placeholder:text-xs"
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <p className="text-md mb-2 text-sm font-medium text-gray-700 sm:mb-1">
                                        Years of Experience
                                    </p>
                                    <input 
                                        type="number"
                                        placeholder="Years of professional experience"
                                        max="50"
                                        required
                                        className="w-full text-sm md:text-base p-4 border-2 border-gray-200 md:rounded-xl 
                                                   focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                                                   transition-all duration-300 
                                                   hover:border-indigo-300
                                                   sm:p-3 sm:rounded-lg  md:placeholder:text-base placeholder:text-xs"
                                        value={jobExp}
                                        onChange={(e) => setJobExp(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex md:justify-end justify-center gap-2 md:space-x-4 space-x-2 pt-4 
                                                sm:flex-col-reverse sm:space-x-0 sm:space-y-3 sm:space-y-reverse md:text-md">
                                    <button 
                                        type="button" 
                                        className="md:px-6 md:py-3 text-gray-600 hover:bg-gray-100 
                                                   rounded-xl transition-colors cursor-pointer
                                                   sm:rounded-lg sm:w-full sm:text-center"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="md:px-7 md:py-3 px-2 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 
                                                   text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 
                                                   transition-all duration-300 
                                                   disabled:opacity-50 disabled:cursor-not-allowed 
                                                   flex items-center shadow-md hover:shadow-lg cursor-pointer
                                                   sm:px-6 sm:rounded-lg sm:w-full sm:justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderCircle className="animate-spin mr-2 sm:w-5 sm:h-5" />
                                                Generating...
                                            </>
                                        ) : (
                                            'Start Interview'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddNewInterview;