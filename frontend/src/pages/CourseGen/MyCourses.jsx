import React, { useEffect, useState } from 'react';
import CourseCard from '../../components/course/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { PlusCircle, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MyCourses = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const NODE_API = import.meta.env.VITE_NODE_API;
    // Track language changes to force component re-render
    useEffect(() => {
        const handleLanguageChange = () => {
            console.log("Language changed to:", i18n.language);
            setLanguage(i18n.language); // Trigger re-render when language changes
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    useEffect(() => {
        console.log("Current Language in MyCourses:", i18n.language);

        if (!user?.token) {
            setIsLoading(false);
            return;
        }

        const fetchCourses = async () => {
            try {
                const response = await fetch(`${NODE_API}/courses/courselist`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const filteredCourses = data
                        .map(course => ({
                            id: course._id,
                            name: course.courseName,
                            topic: course.skills.join(', '),
                            level: course.level,
                            completedChapters: course.chapters.filter(ch => ch.isCompleted).length,
                            totalChapters: course.chapters.length,
                            assignedCopy: course.assignedCopy
                        }))
                        .filter(course => !course.assignedCopy);

                    setCourses(filteredCourses);
                } else {
                    console.error(t('error.fetchCourses'));
                }
            } catch (error) {
                console.error(t('error.fetchCourses'), error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [user?.token, t, language]); // Now reacts to language changes

    return (
        <div className='bg-gray-50 min-h-screen w-full'>
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                <div className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl overflow-visible">
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-0">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 sm:gap-3">
                                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                                {t('myCourses.title')}
                            </h2>
                            <button
                                className="flex items-center justify-center gap-1 sm:gap-2 bg-white text-blue-600 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base w-full sm:w-auto"
                                onClick={() => navigate('/create-course')}
                            >
                                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                {t('myCourses.createCourse')}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48 sm:h-64">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-500"></div>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <p className="text-lg sm:text-xl mb-3 sm:mb-4">{t('myCourses.noCourses')}</p>
                                <p className="text-sm sm:text-base">{t('myCourses.startJourney')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {courses.map(course => (
                                    <div
                                        key={course.id}
                                        className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg sm:hover:shadow-2xl"
                                        onClick={() => navigate(`/course/${course.id}`)}
                                    >
                                        <CourseCard
                                            course={course}
                                            className="cursor-pointer"
                                        />
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

export default MyCourses;
