import React, { useState, useEffect, useMemo } from 'react';
import CourseCard from '../../components/course/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Sparkles } from 'lucide-react';

const RecommendedCourses = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const skillNames = useMemo(() => 
        user.skills?.map(skill => skill.name) || [],
        [user.skills]
    );

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (skillNames.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:5004/api/recommend-courses/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ skills: skillNames }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.map((course, index) => ({
                        id: course.id || `course-${index}`,
                        name: course.course_title,
                        description: course.description,
                        level: course.level,
                        duration_hours: course.duration_hours || 10,
                        totalChapters: course.total_chapters || 5,
                    })));
                    setError(null);
                } else {
                    throw new Error('Failed to fetch recommendations');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching courses');
                setCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => fetchRecommendations(), 300);
        return () => clearTimeout(timer);
    }, [skillNames]);

    const handleEnroll = (course, e) => {
        e.stopPropagation();
        navigate('/create-recommendation', { state: { course } });
    };

    return (
        <div className='bg-gray-50 min-h-screen w-full'>
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                <div className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl overflow-visible">
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                Recommended Courses
                            </h2>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48 sm:h-64">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-purple-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <p className="text-lg sm:text-xl mb-3 sm:mb-4">{error}</p>
                                <p className="text-sm sm:text-base">
                                    Check back later for personalized recommendations
                                </p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <p className="text-lg sm:text-xl mb-3 sm:mb-4">
                                    No recommended courses available
                                </p>
                                <p className="text-sm sm:text-base">
                                    Check back later for personalized recommendations
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl relative"
                                    >
                                        <CourseCard
                                            course={course}
                                            onClick={() => navigate('/create-recommendation', { state: { course } })}
                                            showProgress={false}
                                        />
                                        <button
                                            className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                            onClick={(e) => handleEnroll(course, e)}
                                        >
                                            Enroll
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendedCourses;