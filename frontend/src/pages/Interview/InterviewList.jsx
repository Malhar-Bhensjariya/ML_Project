import React, { useState, useEffect, useMemo } from 'react'
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import InterviewItemCard from './InterviewItemCard';
import axios from 'axios'

const InterviewList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const NODE_API = import.meta.env.VITE_NODE_API;
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${NODE_API}/interview/get-interviews/${user?._id}`);
        setInterviewList(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // Handle "no interviews found" as empty state
          setInterviewList([]);
        } else {
          console.error('Failed to fetch interviews', error);
          toast.error('Failed to load interviews');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchInterviews();
    }
  }, [user]);

  // Memoized calculations for interview statistics
  const interviewStats = useMemo(() => {
    if (interviewList.length === 0) return null;

    const totalInterviews = interviewList.length;
    const averageExperience = (
      interviewList.reduce((sum, interview) => sum + interview.jobExperience, 0) / totalInterviews
    ).toFixed(1);

    return { totalInterviews, averageExperience };
  }, [interviewList]);

  // if (isLoading) {
  //   return (
  //     <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
  //       <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse'></div>
  //     </div>
  //   );
  // }

  return (
    <div className='bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-10 flex flex-col md:flex-row justify-between items-center'>
          <div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>
              Previous Mock Interviews
            </h1>
            <p className='text-gray-600'>
              Track and improve your interview skills
            </p>
          </div>

          {interviewStats && (
            <div className='flex space-x-4 mt-4 md:mt-0'>
              <div className='bg-white shadow-md rounded-xl p-4 text-center'>
                <span className='block text-2xl font-bold text-blue-600'>
                  {interviewStats.totalInterviews}
                </span>
                <span className='text-xs text-gray-500'>Total Interviews</span>
              </div>
            </div>
          )}
        </div>

        {interviewList.length === 0 ? (
          <div className='text-center bg-white shadow-xl rounded-2xl p-16 max-w-xl mx-auto'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-32 w-32 mx-auto text-gray-300 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className='text-3xl font-semibold text-gray-600 mb-4'>
              No Interviews Yet
            </h3>
            <p className='text-gray-500 mb-6'>
              Start your first mock interview to begin your interview preparation journey
            </p>

          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {interviewList.map((interview) => (
              <InterviewItemCard
                key={interview._id}
                interview={interview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewList