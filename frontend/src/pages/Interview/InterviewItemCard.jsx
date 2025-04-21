import { useNavigate } from 'react-router-dom'

const InterviewItemCard = ({ interview }) => {
  const navigate = useNavigate();

  const onStart = () => {
    navigate(`/interview/${interview._id}`);
  }

  const onFeedbackPress = () => {
    navigate(`/interview/${interview._id}/feedback`);
  }

  return (
    <div className='group relative bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl'>
      {/* Decorative Gradient Overlay */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity'></div>
      
      <div className='p-6 relative z-10'>
        {/* Job Details Header */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-grow pr-4'>
            <h2 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors'>
              {interview.jobPosition}
            </h2>
            <div className='flex items-center space-x-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className='text-sm text-gray-600'>
                {interview.jobExperience} Years Experience
              </p>
            </div>
          </div>
          
          {/* Date Pill */}
          <span className='text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
            {new Date(interview.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className='grid grid-cols-2 gap-3 mt-6'>
          <button 
            onClick={onFeedbackPress}
            className='cursor-pointer relative overflow-hidden rounded-lg py-2.5 text-blue-600 border border-blue-500 font-semibold 
            hover:bg-blue-50 transition-all duration-300 group/btn'
          >
            <span className='relative z-10'>View Feedback</span>
            <span className='absolute inset-0 bg-blue-500 opacity-0 group-hover/btn:opacity-10 transition-opacity'></span>
          </button>
          
          <button 
            onClick={onStart}
            className='cursor-pointer relative overflow-hidden rounded-lg py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 
            text-white font-semibold hover:from-blue-600 hover:to-purple-700 
            transition-all duration-300 group/btn'
          >
            <span className='relative z-10'>Start Interview</span>
            <span className='absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity'></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InterviewItemCard