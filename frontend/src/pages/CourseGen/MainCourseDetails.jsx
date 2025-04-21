import React from 'react';
import CourseDetails from './CourseDetails';
import NotesFlashcard from './NotesFlashcard';

const MainCourseDetails = () => {
  return (
    <div className="container mx-auto w-full py-8">
      <div className="max-w-4xl mx-auto">
        {/* CourseDetails Component */}
        <CourseDetails />
        
        {/* NotesFlashcard Component */}
        <NotesFlashcard />
      </div>
    </div>
  );
};

export default MainCourseDetails;