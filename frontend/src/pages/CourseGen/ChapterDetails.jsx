import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { 
    ArrowLeft, 
    Clock, 
    PlayCircle, 
    CheckCircle, 
    Code, 
    BookOpen,
    Pencil,
    FileText,
    Plus,
    Trash2
} from 'lucide-react';
import Chatbot from '../../components/misc/Chatbot';

const ChapterDetails = () => {
    const { courseId, chapterId } = useParams();
    const [chapter, setChapter] = useState(null);
    const navigate = useNavigate();
    const { user, loading } = useUser(); // ✅ Use loading state
    const token = user?.token;
    const NODE_API = import.meta.env.VITE_NODE_API;
    // States for editing functionality
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableChapter, setEditableChapter] = useState(null);
    const [pptFile, setPptFile] = useState(null);


    useEffect(() => {
        if (loading) return; // ✅ Don't fetch until user is fully loaded
        if (!token) {
            navigate('/login'); // ✅ Redirect if no token after loading
            return;
        }

        const fetchChapterDetails = async () => {
            try {
                const response = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setChapter(data);
                    console.log("Chapter: ",data);
                } else {
                    console.error('Failed to fetch chapter data');
                }
            } catch (error) {
                console.error('Error fetching chapter data:', error);
            }
        };

        fetchChapterDetails();
    }, [courseId, chapterId, token, loading, navigate]);

    const handleNextChapter = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Mark current chapter as completed
            const update = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: true }),
            });
            console.log("Update: ",update);

            // Fetch full course details to get chapter list
            const courseResponse = await fetch(`${NODE_API}/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!courseResponse.ok) throw new Error('Failed to fetch course details');

            const courseData = await courseResponse.json();
            const chapters = courseData.chapters;

            const currentIndex = chapters.findIndex(ch => ch._id === chapterId);
            const nextChapter = chapters[currentIndex + 1];

            if (nextChapter) {
                navigate(`/course/${courseId}/chapter/${nextChapter._id}`);
            } else {
                alert("You've completed all chapters!");
                navigate(`/course/${courseId}`);
            }
        } catch (error) {
            console.error('Error advancing to next chapter:', error);
        }
    };

    const handleEditClick = () => {
        setEditableChapter({ ...chapter });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = async () => {
        try {
            // Step 1: Check if a PPT file was uploaded
            let pptUrl = editableChapter.ppt?.url;
    
            if (pptFile) {
                const formData = new FormData();
                formData.append('file', pptFile);
                formData.append('upload_preset', 'PDF_Upload'); // ✅ Cloudinary Upload Preset
    
                // Step 2: Upload to Cloudinary
                const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/dhk1v7s3d/upload`, {
                    method: 'POST',
                    body: formData,
                });
    
                if (cloudinaryResponse.ok) {
                    const cloudData = await cloudinaryResponse.json();
                    pptUrl = cloudData.secure_url;
                    console.log("Uploaded PPT URL:", pptUrl);
                } else {
                    alert("Failed to upload PPT file");
                    return;
                }
            }
    
            // Step 3: Update the chapter with the new PPT URL
            const updatedChapter = {
                ...editableChapter,
                ppt: {
                    ...editableChapter.ppt,
                    link: pptUrl
                }
            };
    
            // Step 4: Send the updated data to your backend
            console.log("Updating chapter:", updatedChapter);
            const response = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}/layout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedChapter),
            });
    
            if (response.ok) {
                console.log("Response:", response);
                setChapter(updatedChapter);
                setIsModalOpen(false);
                alert("Chapter updated successfully!");
            } else {
                alert("Failed to update chapter");
            }
        } catch (error) {
            console.error('Error updating chapter:', error);
            alert("Error updating chapter");
        }
    };
    

    // Handlers for editable fields
    const handleChapterNameChange = (e) => {
        setEditableChapter({ ...editableChapter, chapterName: e.target.value });
    };

    const handleAboutChange = (e) => {
        setEditableChapter({ ...editableChapter, about: e.target.value });
    };

    const handleDurationChange = (e) => {
        setEditableChapter({ ...editableChapter, duration: e.target.value });
    };

    const handleVideoUrlChange = (e) => {
        setEditableChapter({
            ...editableChapter,
            video: { ...editableChapter.video, url: e.target.value }
        });
    };

    const handleVideoThumbnailChange = (e) => {
        const newThumbnail = e.target.value.trim(); // Trim any spaces
    
        setEditableChapter({
            ...editableChapter,
            video: {
                ...editableChapter.video,
                thumbnail: newThumbnail || "https://www.fixrunner.com/wp-content/uploads/2021/05/WordPress-Featured-Image-tw.jpg"
            }
        });
    };
    

    const handleSectionTitleChange = (index, e) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections[index].title = e.target.value;
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const handleSectionExplanationChange = (index, e) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections[index].explanation = e.target.value;
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const handleSectionCodeChange = (index, e) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections[index].codeExample = e.target.value;
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const addNewSection = () => {
        const newSection = {
            _id: uuidv4(),
            title: "New Section",
            explanation: "Enter explanation here",
            codeExample: ""
        };
        setEditableChapter({
            ...editableChapter,
            sections: [...editableChapter.sections, newSection]
        });
    };

    const removeSection = (index) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections.splice(index, 1);
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    // PPT handling
    const handlePptFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPptFile(file);
        }
    };
    

    const handlePptTitleChange = (e) => {
        setEditableChapter({
            ...editableChapter,
            ppt: { ...(editableChapter.ppt || {}), title: e.target.value }
        });
    };

    if (loading) {
        // ✅ Show a loading screen while user/token is being fetched
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">Loading User...</div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">Loading Chapter Details...</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen md:px-8 p-3 ">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-blue-600 text-white p-6">
                    <div className="flex items-center space-x-4 md:mb-4">
                        <button
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                            onClick={() => navigate(`/course/${courseId}`)}
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <h1 className="md:text-3xl text-xl font-bold flex-grow">{chapter.chapterName}</h1>
                        {user.role === "mentor" && (
                            <button onClick={handleEditClick} className="text-white p-2 rounded-full hover:bg-white/30">
                                <Pencil size={24} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="md:p-8 px-4 py-2 md:space-y-6 space-y-2">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="flex items-start mb-4">
                                <BookOpen className="mr-3 mt-1 text-blue-600" size={24} />
                                <div>
                                    <p className="font-semibold text-gray-700">About</p>
                                    <p className="text-gray-600">{chapter.about}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-3 text-blue-600" size={20} />
                                <p><strong className='md:text-base text-sm'>Duration:</strong> {chapter.duration}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 md:p-6 py-1 rounded-xl border border-blue-100">
                            <div className="flex items-center md:mb-4">
                                <CheckCircle className="mr-3 text-blue-600" size={24} />
                                <p className="font-semibold">
                                    Status: {chapter.isCompleted ? "Completed" : "Not Completed"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PPT Section */}
                    {chapter.ppt && chapter.ppt.link && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3 flex items-center">
                                <FileText className="mr-3" size={28} />
                                Presentation
                            </h2>
                            <div className="bg-white border border-blue-100 rounded-xl md:p-5 px-2
                                           shadow-sm hover:shadow-md transition-all duration-300">
                                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                                    {chapter.ppt.title || "Chapter Presentation"}
                                </h3>
                                <a 
                                    href={chapter.ppt.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg 
                                              hover:bg-blue-200 transition flex items-center mt-2"
                                >
                                    <FileText className="mr-2" size={18} />
                                    View Presentation
                                </a>
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3 flex items-center">
                            <Code className="mr-3" size={28} />
                            Sections
                        </h2>
                        <div className="space-y-4">
                            {chapter.sections.map((section) => (
                                <div 
                                    key={section._id} 
                                    className="bg-white border border-blue-100 rounded-xl md:p-5 px-3 py-2
                                               shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <h3 className="text-xl font-semibold text-blue-600 mb-3">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3 md:text-base text-sm">{section.explanation}</p>
                                    {section.codeExample && (
                                        <pre className="bg-blue-50 md:p-4 py-1 px-2 rounded-lg overflow-auto text-sm">
                                            <code className="text-gray-800 md:text-base text-xs">{section.codeExample}</code>
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
    <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3 flex items-center">
        <PlayCircle className="mr-3" size={28} />
        Video
    </h2>
    {chapter.video?.url ? (
        <div 
            className="relative w-full max-w-2xl mx-auto cursor-pointer group" 
            onClick={() => window.open(chapter.video.url, '_blank')}
        >
            <img 
                src={chapter.video.thumbnail || "https://www.fixrunner.com/wp-content/uploads/2021/05/WordPress-Featured-Image-tw.jpg"} 
                alt="Video Thumbnail" 
                className="w-full rounded-xl shadow-lg 
                           group-hover:opacity-80 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-blue-500 p-4 rounded-full 
                                group-hover:scale-110 transition-transform 
                                shadow-xl opacity-90">
                    <PlayCircle size={60} className="text-white" />
                </div>
            </div>
        </div>
    ) : (
        <p className="text-gray-500 text-center">No video available for this chapter.</p>
    )}
</div>


                    <div className="mt-8 text-center">
                        <button
                            className="px-6 py-3 bg-green-500 text-white rounded-lg 
                                       hover:bg-green-600 transition flex items-center justify-center mx-auto"
                            onClick={handleNextChapter}
                        >
                            <CheckCircle className="mr-2" size={15} />
                            Mark as Completed & Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && editableChapter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-5/6 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-semibold mb-6">Edit Chapter</h2>

                        <div className="space-y-6">
                            {/* Basic Chapter Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chapter Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={editableChapter.chapterName}
                                        onChange={handleChapterNameChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        About
                                    </label>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        rows="3"
                                        value={editableChapter.about}
                                        onChange={handleAboutChange}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={editableChapter.duration}
                                        onChange={handleDurationChange}
                                    />
                                </div>
                            </div>

                            {/* Video Section */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <PlayCircle className="mr-2" size={20} />
                                    Video
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Video URL
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            value={editableChapter.video?.url || ''}
                                            onChange={handleVideoUrlChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thumbnail URL
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            value={editableChapter.video?.thumbnail || ''}
                                            onChange={handleVideoThumbnailChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PPT Section */}
<div className="border-t pt-4">
<h3 className="text-lg font-semibold mb-4 flex items-center">
    <FileText className="mr-2" size={20} />
    Presentation (PPT)
</h3>
<div className="space-y-3">
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Presentation Title
        </label>
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={editableChapter.ppt?.title || ''}
            onChange={handlePptTitleChange}
        />
    </div>
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload PPT File
        </label>
        <input
            type="file"
            accept=".ppt,.pptx,application/vnd.ms-powerpoint"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handlePptFileChange}
        />
        {pptFile && (
            <p className="text-sm text-green-600 mt-1">
                📂 {pptFile.name}
            </p>
        )}
    </div>
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Or Enter PPT URL (Optional)
        </label>
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={editableChapter.ppt?.url || ''}
            onChange={handlePptFileChange}
        />
    </div>
</div>
</div>


                            {/* Sections */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold flex items-center">
                                        <Code className="mr-2" size={20} />
                                        Sections
                                    </h3>
                                    <button
                                        onClick={addNewSection}
                                        className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    {editableChapter.sections.map((section, index) => (
                                        <div 
                                            key={section._id || index} 
                                            className="p-4 border border-gray-200 rounded-lg relative"
                                        >
                                            <button
                                                onClick={() => removeSection(index)}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Section Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        value={section.title}
                                                        onChange={(e) => handleSectionTitleChange(index, e)}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Explanation
                                                    </label>
                                                    <textarea
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        rows="3"
                                                        value={section.explanation}
                                                        onChange={(e) => handleSectionExplanationChange(index, e)}
                                                    ></textarea>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Code Example (optional)
                                                    </label>
                                                    <textarea
                                                        className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                                                        rows="5"
                                                        value={section.codeExample || ''}
                                                        onChange={(e) => handleSectionCodeChange(index, e)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <button 
                                onClick={handleCloseModal} 
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveChanges} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Chatbot />
        </div>
    );
};

export default ChapterDetails;