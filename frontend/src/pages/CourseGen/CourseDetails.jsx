import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import {
    ArrowLeft,
    BookOpen,
    Clock,
    Target,
    Layers,
    Star,
    Lock,
    Unlock,
    CheckCircle,
    Pencil,
    Plus,
    Trash2,
    Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useTranslation } from "react-i18next";
import { translateText } from "../../components/language/translateService";

const CourseDetails = () => {
    const { t, i18n } = useTranslation();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const token = user?.token;
    const NODE_API = import.meta.env.VITE_NODE_API;
    const [course, setCourse] = useState(null);
    const [translatedCourse, setTranslatedCourse] = useState(null);
    const [bestAssessmentScore, setBestAssessmentScore] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableCourse, setEditableCourse] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (!token) {
            console.error(t("courseDetails.errors.noToken"));
            return;
        }
        fetchCourseDetails();
    }, [courseId, token]);

    useEffect(() => {
        if (course) {
            translateCourseContent();
        }
    }, [course, i18n.language]);

    const translateCourseContent = async () => {
        if (!course || i18n.language === 'en') {
            setTranslatedCourse(course);
            return;
        }

        setIsTranslating(true);
        try {
            const translations = await Promise.all([
                translateText(course.courseName, i18n.language),
                translateText(course.description, i18n.language),
                Promise.all(course.skills.map(skill => translateText(skill, i18n.language))),
                Promise.all(course.courseOutcomes.map(outcome => translateText(outcome, i18n.language))),
                Promise.all(course.chapters.map(async chapter => ({
                    ...chapter,
                    chapterName: await translateText(chapter.chapterName, i18n.language),
                    about: await translateText(chapter.about, i18n.language)
                })))
            ]);

            setTranslatedCourse({
                ...course,
                courseName: translations[0],
                description: translations[1],
                skills: translations[2],
                courseOutcomes: translations[3],
                chapters: translations[4]
            });
        } catch (error) {
            console.error(t("courseDetails.errors.translationError"), error);
            setTranslatedCourse(course); // Fallback to original if translation fails
        } finally {
            setIsTranslating(false);
        }
    };

    const fetchCourseDetails = async () => {
        try {
            const response = await fetch(`${NODE_API}/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setCourse(data);
                checkFinalAssessment(data);
            } else {
                console.error(t("courseDetails.errors.fetchFailed"));
            }
        } catch (error) {
            console.error(t("courseDetails.errors.fetchError"), error);
        }
    };

    const checkFinalAssessment = async (courseData) => {
        try {
            const response = await fetch(`${NODE_API}/assessment/course/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const assessments = await response.json();
                const bestScore = Math.max(...assessments.map(a => a.score || 0));
                setBestAssessmentScore(bestScore);

                if (bestScore >= 70 && courseData?.passedFinal === false) {
                    await updateCoursePassedFinal(true);
                    fetchCourseDetails();
                }
            } else {
                console.log('No assessments found for this course.');
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
        }
    };

    const updateCoursePassedFinal = async (status) => {
        try {
            console.log("Updating course passedFinal status to:", status);
            const response = await fetch(`${NODE_API}/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ passedFinal: status }),
            });

            if (!response.ok) {
                console.error('Failed to update course passedFinal status');
            }
        } catch (error) {
            console.error('Error updating course status:', error);
        }
    };

    const generateCertificate = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Page dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        // Add background color
        doc.setFillColor(240, 248, 255); // Light blue background
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Add elegant border with rounded corners
        doc.setDrawColor(65, 105, 225); // Royal blue border
        doc.setLineWidth(3);
        // Using lines to create a border with more margin space
        const margin = 15;
        doc.roundedRect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2), 5, 5, 'S');
        
        // Add decorative corner elements
        addCornerDecorations(doc, margin);
        
        // Add certificate title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setTextColor(25, 25, 112); // Dark blue
        doc.text('Certificate of Completion', pageWidth / 2, 45, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 80, 52, pageWidth / 2 + 80, 52);
        
        // Add certificate text with better spacing
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });
        
        // Add name - limit length if needed
        const userName = user.name || 'Student Name';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(25, 25, 112);
        doc.text(limitTextLength(userName, 40), pageWidth / 2, 85, { align: 'center' });
        
        // Add completion text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('has successfully completed the course', pageWidth / 2, 105, { align: 'center' });
        
        // Add course name - limit length if needed
        const courseName = limitTextLength(course.courseName, 50);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(25, 25, 112);
        
        // Handle long course names by splitting if necessary
        if (courseName.length > 30) {
            const words = courseName.split(' ');
            let line1 = '';
            let line2 = '';
            
            let i = 0;
            while (i < words.length) {
                if ((line1 + words[i] + ' ').length <= 30) {
                    line1 += words[i] + ' ';
                } else {
                    break;
                }
                i++;
            }
            
            while (i < words.length) {
                line2 += words[i] + ' ';
                i++;
            }
            
            doc.text(line1.trim(), pageWidth / 2, 125, { align: 'center' });
            if (line2.trim()) {
                doc.text(line2.trim(), pageWidth / 2, 135, { align: 'center' });
            }
        } else {
            doc.text(courseName, pageWidth / 2, 125, { align: 'center' });
        }
        
        // Add score if available with adjusted position
        const scoreY = courseName.length > 30 ? 150 : 140;
        if (bestAssessmentScore !== null) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`with a score of ${bestAssessmentScore}%`, pageWidth / 2, scoreY, { align: 'center' });
        }
        
        // Add date
        const currentDate = new Date();
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
        
        // Position date based on whether score is displayed
        const dateY = bestAssessmentScore !== null ? scoreY + 20 : scoreY + 5;
        doc.setFontSize(14);
        doc.text(`Issued on: ${formattedDate}`, pageWidth / 2, dateY, { align: 'center' });
        
        // Add signature line
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 50, pageHeight - 50, pageWidth / 2 + 50, pageHeight - 50);
        
        // Add issuer text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Issued By:', pageWidth / 2, pageHeight - 40, { align: 'center' });
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(65, 105, 225);
        doc.text('AthenaAI', pageWidth / 2, pageHeight - 30, { align: 'center' });
        
        // Save the PDF with sanitized filename
        doc.save(`${sanitizeFilename(course.courseName)}_Certificate.pdf`);
    };
    
    // Helper function to limit text length
    function limitTextLength(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + '...';
    }
    
    // Helper function to sanitize filename
    function sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    
    // Function to add decorative corners
    function addCornerDecorations(doc, margin) {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const cornerSize = 10;
        
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(1);
        
        // Top-left corner
        doc.line(margin - 5, margin + cornerSize, margin - 5, margin - 5); // Vertical line
        doc.line(margin - 5, margin - 5, margin + cornerSize, margin - 5); // Horizontal line
        
        // Top-right corner
        doc.line(pageWidth - margin + 5, margin + cornerSize, pageWidth - margin + 5, margin - 5); // Vertical line
        doc.line(pageWidth - margin + 5, margin - 5, pageWidth - margin - cornerSize, margin - 5); // Horizontal line
        
        // Bottom-left corner
        doc.line(margin - 5, pageHeight - margin - cornerSize, margin - 5, pageHeight - margin + 5); // Vertical line
        doc.line(margin - 5, pageHeight - margin + 5, margin + cornerSize, pageHeight - margin + 5); // Horizontal line
        
        // Bottom-right corner
        doc.line(pageWidth - margin + 5, pageHeight - margin - cornerSize, pageWidth - margin + 5, pageHeight - margin + 5); // Vertical line
        doc.line(pageWidth - margin + 5, pageHeight - margin + 5, pageWidth - margin - cornerSize, pageHeight - margin + 5); // Horizontal line
    }    

    const handleChapterClick = (chapterId) => {
        navigate(`/course/${courseId}/chapter/${chapterId}`);
    };

    const handleEditClick = () => {
        setEditableCourse({ ...course });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Add a new chapter to the editable course
    const handleAddChapter = () => {
        if (editableCourse.chapters.length >= 5) {
            alert("A course can have a maximum of 5 chapters only.");
            return;
        }
    
        const newChapter = {
            _id: uuidv4(), // Temporary ID
            chapterName: 'New Chapter',
            about: 'Chapter description',
            duration: '30 mins',
            isCompleted: false
        };
    
        setEditableCourse({
            ...editableCourse,
            chapters: [...editableCourse.chapters, newChapter]
        });
    };
    

    // Remove a chapter from the editable course
    const handleRemoveChapter = async (index, chapterId) => {
        const updatedChapters = [...editableCourse.chapters];
        updatedChapters.splice(index, 1);
    
        // ✅ Immediately update the UI (temporarily)
        setEditableCourse({
            ...editableCourse,
            chapters: updatedChapters
        });
    
        // ✅ If chapter has a MongoDB _id, send a DELETE request
        if (chapterId) {
            try {
                const response = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.ok) {
                    // ✅ After successful delete, refetch the course from MongoDB
                    fetchCourseDetails();  // 💯 THIS IS THE FIX!
                } else {
                    console.error('Failed to delete chapter from database');
                }
            } catch (error) {
                console.error('Error deleting chapter:', error);
            }
        }
    };
    

    const handleSaveChanges = async () => {
        if (!editableCourse.chapters || editableCourse.chapters.length === 0) {
            alert("A course must have at least one chapter.");
            return;
        }
    
        if (editableCourse.chapters.length > 5) {
            alert("A course can have a maximum of 5 chapters only.");
            return;
        }
    
        // ✅ Remove Temporary _id for new chapters
        const processedChapters = editableCourse.chapters.map(chapter => {
            if (chapter._id?.includes('-')) delete chapter._id;
            return chapter;
        });
    
        const courseDataToSend = {
            ...editableCourse,
            chapters: processedChapters
        };
    
        try {
            console.log("Updating course layout:", courseDataToSend);
            const response = await fetch(`${NODE_API}/courses/${courseId}/layout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseDataToSend),
            });
    
            if (response.ok) {
                alert("Course updated successfully!");
                const data = await response.json();
                setCourse(data.course);
                setIsModalOpen(false);
                fetchCourseDetails();
            } else {
                const errorData = await response.json();
                alert(`Failed to update course: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert(`Error updating course: ${error.message}`);
        }
    };
    
    if (!course || !translatedCourse) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">
                    {t("courseDetails.loading")}
                </div>
            </div>
        );
    }

    const allChaptersCompleted = translatedCourse?.chapters.every(chapter => chapter.isCompleted);
    const { passedFinal } = translatedCourse || {};

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen md:p-8 px-3">
            {isTranslating && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>{t("courseDetails.translating")}</p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-blue-600 text-white p-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                            onClick={() => navigate('/my-courses')}
                            aria-label={t("courseDetails.buttons.back")}
                        >
                            <ArrowLeft className="text-white" size={20} />
                        </button>
                        <h1 className="md:text-3xl text-2xl font-bold flex-grow">{translatedCourse.courseName}</h1>
                        {user.role === "mentor" && (
                            <button 
                                onClick={handleEditClick} 
                                className="text-white p-2 rounded-full hover:bg-white/30"
                                aria-label={t("courseDetails.buttons.edit")}
                            >
                                <Pencil size={24} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <BookOpen className="mr-3 text-blue-600" size={24} />
                                <p className="text-gray-700">
                                    <strong>{t("courseDetails.description")}:</strong> {translatedCourse.description}
                                </p>
                            </div>

                            <div className="flex items-center mb-4">
                                <Layers className="mr-3 text-blue-600" size={24} />
                                <p className="text-gray-700">
                                    <strong>{t("courseDetails.skills")}:</strong> {translatedCourse.skills.join(', ')}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-4 gap-2 md:text-md text-sm grid-cols-1">
                                <div className="flex items-center">
                                    <Star className="mr-2 text-blue-600" size={20} />
                                    <span><strong>{t("courseDetails.level")}:</strong> {translatedCourse.level}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 text-blue-600" size={20} />
                                    <span><strong>{t("courseDetails.duration")}:</strong> {translatedCourse.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center mb-4">
                                <Target className="mr-3 text-blue-600" size={24} />
                                <h2 className="md:text-xl font-semibold">{t("courseDetails.outcomesTitle")}</h2>
                            </div>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {translatedCourse.courseOutcomes.map((outcome, index) => (
                                    <li key={index} className="pl-2 md:text-md text-sm">{outcome}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b md:pb-3">
                        {t("courseDetails.chaptersTitle")}
                    </h2>
                    <div className="space-y-4">
                        {translatedCourse.chapters.map((chapter) => (
                            <div
                                key={chapter._id}
                                className="bg-white border border-blue-100 rounded-xl p-5 
                                           shadow-sm hover:shadow-md transition-all duration-300 
                                           cursor-pointer hover:border-blue-300 
                                           transform hover:-translate-y-1"
                                onClick={() => handleChapterClick(chapter._id)}
                            >
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                    {chapter.chapterName}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    <strong>{t("courseDetails.about")}:</strong> {chapter.about}
                                </p>
                                <div className="flex items-center text-gray-500">
                                    <Clock className="mr-2" size={16} />
                                    <span>{chapter.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-700 border-b pb-3">
                        {t("courseDetails.assessmentTitle")}
                    </h2>

                    <div
                        className={`flex items-center justify-between p-5 rounded-xl shadow-md border
                                    ${passedFinal
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : allChaptersCompleted
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-pointer hover:bg-blue-100'
                                    : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        onClick={() => {
                            if (!passedFinal && allChaptersCompleted) {
                                navigate(`/course/${courseId}/course-assessment`, {
                                    state: {
                                        topic: translatedCourse.courseName,
                                        skills: translatedCourse.skills,
                                        difficultyLevel: translatedCourse.level,
                                    }
                                });
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {passedFinal ? <CheckCircle size={24} className="text-green-600" />
                                : allChaptersCompleted ? <Unlock size={24} className="text-blue-600" />
                                    : <Lock size={24} className="text-gray-500" />
                            }
                            <div>
                                <span className="font-medium text-lg">
                                    {translatedCourse.courseName} {t("courseDetails.finalAssessment")}
                                </span>
                                {bestAssessmentScore !== null && (
                                    <div className="text-sm">
                                        {t("courseDetails.bestScore")}: {bestAssessmentScore}%
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="font-semibold">
                            {passedFinal ? t("courseDetails.completed") 
                                : allChaptersCompleted ? t("courseDetails.unlocked") 
                                    : t("courseDetails.locked")}
                        </span>
                    </div>
                    
                    {passedFinal && (
                        <div className="mt-6">
                            <button
                                onClick={generateCertificate}
                                className="flex items-center justify-center w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg"
                            >
                                <Download size={24} className="mr-2" />
                                <span className="font-semibold text-lg">
                                    {t("courseDetails.downloadCertificate")}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Course Modal - Use original course data for editing */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-5/6 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-semibold mb-4">{t("courseDetails.editTitle")}</h2>

                        {/* Editable course content */}
                        <div className="space-y-4">
                            <div className="mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                                <div className="bg-blue-600 text-white p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <input
                                            className="text-3xl font-bold flex-grow p-2 border rounded-xl bg-white text-gray-800"
                                            value={editableCourse?.courseName || ''}
                                            onChange={(e) => setEditableCourse({ ...editableCourse, courseName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <div className="flex items-center mb-4">
                                                <BookOpen className="mr-3 text-blue-600 flex-shrink-0" size={24} />
                                                <textarea
                                                    className="w-full p-2 border rounded-xl"
                                                    rows="4"
                                                    value={editableCourse?.description || ''}
                                                    onChange={(e) => setEditableCourse({ ...editableCourse, description: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex items-center mb-4">
                                                <Layers className="mr-3 text-blue-600 flex-shrink-0" size={24} />
                                                <input
                                                    className="w-full p-2 border rounded-xl"
                                                    value={editableCourse?.skills.join(', ') || ''}
                                                    onChange={(e) => setEditableCourse({
                                                        ...editableCourse,
                                                        skills: e.target.value.split(',').map(skill => skill.trim())
                                                    })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center">
                                                    <Star className="mr-2 text-blue-600 flex-shrink-0" size={20} />
                                                    <input
                                                        className="w-full p-2 border rounded-xl"
                                                        value={editableCourse?.level || ''}
                                                        onChange={(e) => setEditableCourse({ ...editableCourse, level: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="mr-2 text-blue-600 flex-shrink-0" size={20} />
                                                    <input
                                                        className="w-full p-2 border rounded-xl"
                                                        value={editableCourse?.duration || ''}
                                                        onChange={(e) => setEditableCourse({ ...editableCourse, duration: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                            <div className="flex items-center mb-4">
                                                <Target className="mr-3 text-blue-600" size={24} />
                                                <h2 className="text-xl font-semibold">Course Outcomes</h2>
                                            </div>
                                            <textarea
                                                className="w-full p-2 border rounded-xl"
                                                rows="4"
                                                value={editableCourse?.courseOutcomes.join('\n') || ''}
                                                onChange={(e) => setEditableCourse({
                                                    ...editableCourse,
                                                    courseOutcomes: e.target.value.split('\n').filter(line => line.trim() !== '')
                                                })}
                                                placeholder="Enter each outcome on a new line"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold text-blue-700">Course Chapters</h2>
                                        <button 
                                            onClick={handleAddChapter}
                                            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                        >
                                            <Plus size={18} className="mr-1" />
                                            Add Chapter
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {editableCourse?.chapters.map((chapter, index) => (
                                            <div
                                                key={chapter._id || chapter.tempId}
                                                className="bg-white border border-blue-100 rounded-xl p-5 relative"
                                            >
                                                <button 
                                                    onClick={() => handleRemoveChapter(index, chapter._id)}
                                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                                                    <input
                                                        className="w-full p-2 border rounded-xl"
                                                        value={chapter.chapterName}
                                                        onChange={(e) => {
                                                            const updatedChapters = [...editableCourse.chapters];
                                                            updatedChapters[index].chapterName = e.target.value;
                                                            setEditableCourse({ ...editableCourse, chapters: updatedChapters });
                                                        }}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                                    <textarea
                                                        className="w-full p-2 border rounded-xl"
                                                        rows="3"
                                                        value={chapter.about}
                                                        onChange={(e) => {
                                                            const updatedChapters = [...editableCourse.chapters];
                                                            updatedChapters[index].about = e.target.value;
                                                            setEditableCourse({ ...editableCourse, chapters: updatedChapters });
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center text-gray-500">
                                                    <Clock className="mr-2 flex-shrink-0" size={16} />
                                                    <input
                                                        className="w-full p-2 border rounded-xl"
                                                        placeholder="e.g. 30 mins"
                                                        value={chapter.duration}
                                                        onChange={(e) => {
                                                            const updatedChapters = [...editableCourse.chapters];
                                                            updatedChapters[index].duration = e.target.value;
                                                            setEditableCourse({ ...editableCourse, chapters: updatedChapters });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button 
                                onClick={handleCloseModal} 
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveChanges} 
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;