import React, { useEffect, useState } from "react";
import CourseCard from "../../components/course/CourseCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { BookUser, ChevronRight } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AssignedCourses = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const NODE_API = import.meta.env.VITE_NODE_API;
    useEffect(() => {
        if (!user?.token || !user?._id) {
            setIsLoading(false);
            return;
        }

        const fetchAssignedCourses = async () => {
            try {
                const response = await axios.get(
                    `${NODE_API}/assigned/assigned-courses/${user._id}`
                );

                if (response.data && response.data.courses) {
                    const formattedCourses = response.data.courses.map(course => ({
                        id: course._id,
                        name: course.courseName,
                        topic: course.skills?.join(", "),
                        level: course.level,
                        description: course.description,
                        passedFinal: course.passedFinal,
                        assignedBy: course.mentor,
                        assignedDate: new Date(course.assignedDate).toLocaleDateString(),
                    }));
                    setAssignedCourses(formattedCourses);
                }
            } catch (error) {
                console.error("Error fetching assigned courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignedCourses();
    }, [user?.token, user?._id]);

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-visible mt-8">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            <BookUser className="w-8 h-8" />
                            {t("assignedCourses.title")}
                        </h2>
                        {assignedCourses.length > 0 && (
                            <div className="bg-white/20 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm">
                                {t("assignedCourses.assignedMessage", { count: assignedCourses.length })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        </div>
                    ) : assignedCourses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 h-64 flex flex-col justify-center">
                            <p className="text-xl mb-4">{t("assignedCourses.noCourses")}</p>
                            <p>{t("assignedCourses.waitingMessage")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assignedCourses.map(course => (
                                <div
                                    key={course.id}
                                    className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105 cursor-pointer"
                                    onClick={() => handleCourseClick(course.id)}
                                >
                                    <div className="p-5 h-full flex flex-col">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span
                                                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                                                        course.level === "Basic"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : course.level === "Intermediate"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {t(`courseLevels.${course.level}`)}
                                                </span>
                                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                                    {course.topic}
                                                </span>
                                                {course.passedFinal && (
                                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                        {t("assignedCourses.completed")}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                {course.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {course.description}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                {t("assignedCourses.assignedOn", { date: course.assignedDate })}
                                            </p>
                                        </div>
                                        <div className="mt-auto">
                                            <button
                                                className="flex items-center justify-center w-full gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCourseClick(course.id);
                                                }}
                                            >
                                                {t("assignedCourses.startLearning")}
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignedCourses;
