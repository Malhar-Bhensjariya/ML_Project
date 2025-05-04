import React, { useState, useEffect } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CreateRecommend = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const NODE_API = import.meta.env.VITE_NODE_API;
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location.state?.course) {
            toast.error("No course data provided");
            navigate('/recommended-courses');
            return;
        }
        setCourseData(location.state.course);
    }, [location, navigate]);

    const generateChapterContent = async (chapterPayload) => {
        try {
            const response = await fetch(`${NODE_API}/generate-chapter-content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chapterPayload),
            });

            if (!response.ok) throw new Error("Chapter content generation failed");
            return await response.json();
        } catch (error) {
            console.error("Error generating chapter content:", error);
            toast.warning(`Skipped content generation for ${chapterPayload.chapterName}`);
            return { sections: [], video: null };
        }
    };

    const finalizeCourse = async () => {
        if (!courseData) return;

        setIsProcessing(true);
        try {
            // Generate base course structure
            const coursePayload = {
                courseName: courseData.name,
                description: courseData.description || "Recommended course based on your skills",
                skills: courseData.skills || ["Recommended"],
                level: courseData.level || "Intermediate",
                duration: courseData.duration_hours ? `${courseData.duration_hours} hours` : "1 hour",
                noOfChapters: courseData.totalChapters || 3,
            };

            // Generate chapters
            const chapters = [];
            for (let i = 1; i <= coursePayload.noOfChapters; i++) {
                const chapterPayload = {
                    chapterName: `Module ${i}`,
                    about: `Essential ${courseData.name} concepts for chapter ${i}`,
                    duration: "45 minutes",
                    content: ["Basic theory", "Practical examples", "Exercises"],
                    difficulty: coursePayload.level,
                };

                const { sections, video } = await generateChapterContent(chapterPayload);
                
                chapters.push({
                    chapterName: chapterPayload.chapterName,
                    about: chapterPayload.about,
                    duration: chapterPayload.duration,
                    sections,
                    video: video ?? { url: null, thumbnail: null },
                    isCompleted: false
                });
            }

            // Create full course payload
            const fullCourse = {
                ...coursePayload,
                courseOutcomes: [
                    "Master core concepts",
                    "Apply practical skills",
                    "Complete learning path"
                ],
                chapters
            };

            // Save course
            const token = user?.token;
            if (!token) {
                toast.error("Session expired, please login again");
                return;
            }

            const response = await axios.post(
                `${NODE_API}/courses/create-courses`,
                fullCourse,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Course created successfully!");
            const courseId = response.data?.course?._id;

            if (courseId) {
                if (user?.userType === 'Mentor') {
                    await axios.post(`${NODE_API}/assigned/`, {
                        mentor: user._id,
                        assigns: [],
                        orgCourseId: courseId,
                        dueDate: null
                    });
                }
                navigate(`/course/${courseId}`);
            }
        } catch (error) {
            console.error("Course creation failed:", error);
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!courseData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position="top-right" richColors />
            <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto my-4 sm:my-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 text-center mb-6">
                    Finalize Recommended Course
                </h2>

                <div className="flex justify-center mb-8">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white">
                        <FaWandMagicSparkles className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-purple-700">{courseData.name}</h3>
                        
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                            <p className="text-gray-700 mb-4">
                                <strong>Description:</strong> {courseData.description || "No description available"}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                <p><strong>Level:</strong> {courseData.level || "Intermediate"}</p>
                                <p><strong>Duration:</strong> {courseData.duration_hours ? `${courseData.duration_hours} hours` : "1 hour"}</p>
                                <p><strong>Chapters:</strong> {courseData.totalChapters || 3}</p>
                            </div>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-lg text-gray-600 mb-6">
                                Ready to generate and enroll in this course?
                            </p>
                            <button
                                onClick={finalizeCourse}
                                disabled={isProcessing}
                                className={`px-6 py-3 rounded-lg flex items-center justify-center mx-auto ${
                                    isProcessing
                                    ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                        Generating Content...
                                    </>
                                ) : 'Create Course'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRecommend;