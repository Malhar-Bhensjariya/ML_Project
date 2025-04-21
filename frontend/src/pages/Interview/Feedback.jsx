import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const NODE_API = import.meta.env.VITE_NODE_API;
  useEffect(() => {
    const GetFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${NODE_API}/interview/feedback/${interviewId}`);
        setFeedbackList(response.data);
        setIsLoading(false);
      } catch (err) {
        toast.error('Failed to fetch interview feedback', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsLoading(false);
        navigate('/interview');
      }
    };

    GetFeedback();
  }, [interviewId, navigate]);

  const toggleCollapsible = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-gray-100'>
        <div className='animate-pulse w-16 h-16 bg-blue-500 rounded-full'></div>
      </div>
    );
  }

  // Calculate overall performance
  const calculateOverallRating = () => {
    if (!feedbackList.length) return 0;
    const totalRating = feedbackList.reduce((sum, item) => sum + parseFloat(item.rating || 0), 0);
    return (totalRating / feedbackList.length).toFixed(1);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        {/* Header Section */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-3xl font-bold text-white mb-2'>Interview Feedback</h2>
              <p className='text-white/80'>Detailed insights into your performance</p>
            </div>
            <div className='bg-white/20 rounded-full p-4'>
              <span className='text-2xl font-bold text-white'>{calculateOverallRating()}/10</span>
            </div>
          </div>
        </div>

        {/* No Feedback Handling */}
        {feedbackList?.length === 0 ? (
          <div className='text-center p-12'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-24 w-24 mx-auto text-gray-300 mb-4"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className='text-2xl font-semibold text-gray-600'>No Feedback Available</h2>
            <p className='text-gray-500 mt-2'>Check back later or contact support</p>
          </div>
        ) : (
          <div className='p-8 space-y-6'>
            {feedbackList.map((item, index) => (
              <div 
                key={index} 
                className='border-l-4 border-blue-500 bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg'
              >
                <div 
                  onClick={() => toggleCollapsible(index)}
                  className='p-5 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors'
                >
                  <h3 className='text-lg font-semibold text-gray-800 flex-grow pr-4'>{item.question}</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {openIndex === index && (
                  <div className='p-6 space-y-4 bg-white'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div className='bg-red-50 border border-red-200 p-4 rounded-lg'>
                        <h4 className='text-red-600 font-semibold mb-2'>Rating</h4>
                        <p className='text-red-900'>{item.rating}/10</p>
                      </div>
                      <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
                        <h4 className='text-blue-600 font-semibold mb-2'>Feedback</h4>
                        <p className='text-blue-900'>{item.feedback}</p>
                      </div>
                    </div>
                    <div className='bg-gray-50 border border-gray-200 p-4 rounded-lg'>
                      <h4 className='text-gray-600 font-semibold mb-2'>Your Answer</h4>
                      <p className='text-gray-900 italic'>{item.userAns}</p>
                    </div>
                    <div className='bg-green-50 border border-green-200 p-4 rounded-lg'>
                      <h4 className='text-green-600 font-semibold mb-2'>Correct Answer</h4>
                      <p className='text-green-900'>{item.correctAns}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Button */}
        <div className='p-6 bg-gray-100'>
          <button 
            onClick={() => navigate('/interview')}
            className='cursor-pointer w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Back to Interview Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feedback