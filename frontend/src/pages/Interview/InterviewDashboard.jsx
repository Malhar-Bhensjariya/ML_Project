import React from 'react'
import AddNewInterview from './AddNewInterview'
import InterviewList from './InterviewList'

const InterviewDashboard = () => {
  return (
    <div className='flex flex-col'>
        <AddNewInterview/>
        <InterviewList/>
    </div>
  )
}

export default InterviewDashboard