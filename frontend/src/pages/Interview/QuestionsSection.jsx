import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            toast.error('Sorry, Your browser does not support text to speech');
        }
    };

    return (
        mockInterviewQuestion && (
            <div className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border-none transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                {/* Question selector - scrollable horizontally on mobile */}
                <div className="flex sm:grid overflow-x-auto pb-2 sm:pb-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 hide-scrollbar">
                    {mockInterviewQuestion.map((question, index) => (
                        <div 
                            key={index} 
                            className={`
                                rounded-full px-3 py-1.5 text-center text-xs md:text-sm 
                                transition-all duration-300 ease-in-out cursor-pointer
                                flex-shrink-0 whitespace-nowrap
                                ${activeQuestionIndex === index 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                            `}
                        >
                            Question #{index + 1}
                        </div>
                    ))}
                </div>
                
                {/* Question content - more compact on mobile */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-5 mb-3 sm:mb-6 shadow-sm space-y-2 sm:space-y-4">
                    <h2 className="text-sm md:text-lg text-gray-800 font-medium">
                        {mockInterviewQuestion[activeQuestionIndex]?.question}
                    </h2>
                    <div className="flex flex-col items-start">
                        <Volume2
                            className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer w-6 h-6 sm:w-8 sm:h-8"
                            onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
                        />
                    </div>
                </div>
                
                {/* Note section - more compact on mobile */}
                <div className='border-l-3 sm:border-l-4 border-blue-500 bg-blue-50 p-2 sm:p-4 rounded-r-lg'>
                    <div className='flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2'>
                        <Lightbulb className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                        <strong className="text-blue-700 text-xs sm:text-sm">Note:</strong>
                    </div>
                    <p className='text-xs sm:text-sm text-blue-800 leading-relaxed'>
                        Click on record answer when you want to answer the question. At the end of the interview, we will provide feedback along with the correct answer for each question and your answer to compare it.
                    </p>
                </div>
            </div>
        )
    );
};

export default QuestionsSection;
