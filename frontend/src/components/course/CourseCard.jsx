import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown } from 'lucide-react';
import AssignMentees from './AssignMentees';
import { useUser } from '../../context/UserContext';

const CourseCard = ({ course, onClick, showProgress = true }) => {
    const { user } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);

    // Only calculate progress if we're showing it
    const progress = showProgress && course.totalChapters > 0
        ? (course.completedChapters / course.totalChapters) * 100
        : 0;

    const getProgressColor = () => {
        if (progress < 33) return 'bg-red-500';
        if (progress < 66) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div
            className="border-1 rounded-xl p-3 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50 transform hover:-translate-y-2 space-y-3 md:space-y-4"
            onClick={onClick}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 className="font-bold text-lg md:text-xl text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    {course.name}
                </h3>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium mt-1 sm:mt-0">
                    {course.level} Level
                </div>
            </div>

            {showProgress && (
                <div className="mt-2 md:mt-4">
                    <div className="h-2 md:h-3 w-full bg-gray-200 rounded-full overflow-auto mb-1 md:mb-2">
                        <div
                            className={`h-full ${getProgressColor()} transition-all`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1 xs:gap-0">
                        <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                            {course.completedChapters} / {course.totalChapters} Chapters
                        </p>
                        <p className="text-xs md:text-sm font-medium text-gray-700">
                            {Math.round(progress)}% Complete
                        </p>
                    </div>
                </div>
            )}

            {user?.userType === "Mentor" && (
                <div className="relative mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 hover:bg-blue-700 transition text-sm md:text-base"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(!showDropdown);
                        }}
                    >
                        Assign
                        <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    {showDropdown && (
                        <AssignMentees
                            courseId={course.id}
                            closeDropdown={() => setShowDropdown(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseCard;