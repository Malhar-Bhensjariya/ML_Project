import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Save, FileQuestion, Users, Info } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExam = () => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        mentorId: user?._id || "",
        title: "",
        description: "",
        questions: [
            {
                questionText: "",
                options: ["", "", "", ""],
                correctAnswer: ""
            }
        ],
        assignedMentees: []
    });

    const [mentees, setMentees] = useState([]);
    const [showMenteeSelector, setShowMenteeSelector] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingMentees, setIsFetchingMentees] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;
    useEffect(() => {
        // Set mentor ID when user is loaded
        if (user?._id && !formData.mentorId) {
            setFormData(prev => ({ ...prev, mentorId: user._id }));
        }
    }, [user, formData.mentorId]);

    const fetchMentees = async () => {
        if (!user?._id) {
            toast.error("User information not available");
            return;
        }

        setIsFetchingMentees(true);
        try {
            const response = await fetch(`${NODE_API}/users/mentees/${user._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mentees');
            }
            const data = await response.json();
            setMentees(data.mentees);
            setShowMenteeSelector(true);
            
            if (data.mentees.length === 0) {
                toast.info("No mentees found. Please add mentees first.");
            }
        } catch (error) {
            console.error("Failed to fetch mentees:", error);
            toast.error("Failed to load mentees list. Please try again.");
        } finally {
            setIsFetchingMentees(false);
        }
    };

    const handleToggleMenteeSelector = () => {
        if (!showMenteeSelector && mentees.length === 0) {
            fetchMentees();
        } else {
            setShowMenteeSelector(!showMenteeSelector);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const handleCorrectAnswerChange = (questionIndex, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].correctAnswer = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    questionText: "",
                    options: ["", "", "", ""],
                    correctAnswer: ""
                }
            ]
        });
        toast.info("New question added!");
    };

    const removeQuestion = (index) => {
        if (formData.questions.length > 1) {
            const updatedQuestions = [...formData.questions];
            updatedQuestions.splice(index, 1);
            setFormData({
                ...formData,
                questions: updatedQuestions
            });
            toast.info("Question removed");
        } else {
            toast.warn("You need at least one question");
        }
    };

    const toggleMenteeSelection = (menteeId) => {
        if (formData.assignedMentees.includes(menteeId)) {
            setFormData({
                ...formData,
                assignedMentees: formData.assignedMentees.filter(id => id !== menteeId)
            });
        } else {
            setFormData({
                ...formData,
                assignedMentees: [...formData.assignedMentees, menteeId]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?._id) {
            toast.error("User information not available. Cannot create exam.");
            return;
        }

        // Ensure mentorId is set from user context
        const examData = {
            ...formData,
            mentorId: user._id
        };

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${NODE_API}/exam/create`, examData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            toast.success("Exam created successfully!");
            
            // Reset form
            setFormData({
                mentorId: user._id,
                title: "",
                description: "",
                questions: [
                    {
                        questionText: "",
                        options: ["", "", "", ""],
                        correctAnswer: ""
                    }
                ],
                assignedMentees: []
            });

            setShowMenteeSelector(false);
        } catch (error) {
            console.error("Error creating exam:", error);
            toast.error("Failed to create exam. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Create New Exam</h1>
                <p className="text-blue-100">Design your exam and assign it to mentees</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-8">
                    {/* Basic Exam Info */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Info className="mr-2 text-blue-600" size={20} />
                            Exam Details
                        </h2>
                        
                        <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                                Exam Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g., JavaScript Fundamentals"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Describe the purpose and content of this exam"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <FileQuestion className="mr-2 text-blue-600" size={20} />
                                Questions
                            </h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm cursor-pointer"
                            >
                                <PlusCircle size={16} className="mr-2" />
                                Add Question
                            </button>
                        </div>

                        {formData.questions.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-xl mb-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
                                            {qIndex + 1}
                                        </span>
                                        Question {qIndex + 1}
                                    </h3>
                                    {formData.questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition-colors duration-200 cursor-pointer"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={question.questionText}
                                        onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        placeholder="Enter your question"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center">
                                            <div className="bg-gray-100 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
                                                {String.fromCharCode(65 + oIndex)}
                                            </div>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Correct Answer
                                    </label>
                                    <select
                                        value={question.correctAnswer}
                                        onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                                        required
                                    >
                                        <option value="">Select correct answer</option>
                                        {question.options.map((option, index) => (
                                            option && <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mentee Assignment Section */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <Users className="mr-2 text-blue-600" size={20} />
                                Assign Mentees
                            </h2>
                            <button
                                type="button"
                                onClick={handleToggleMenteeSelector}
                                disabled={isFetchingMentees}
                                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer shadow-sm ${
                                    isFetchingMentees
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                }`}
                            >
                                {isFetchingMentees
                                    ? 'Loading...'
                                    : showMenteeSelector
                                        ? 'Hide Mentees'
                                        : 'Show Mentees'}
                            </button>
                        </div>

                        {showMenteeSelector && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                {mentees.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                        <Users size={48} className="text-gray-300 mb-4" />
                                        <p>No mentees found. Please add mentees first.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-3 text-sm text-gray-500 flex items-center">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">
                                                {formData.assignedMentees.length}
                                            </span>
                                            mentee(s) selected
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 rounded-lg">
                                            {mentees.map((mentee) => (
                                                <div
                                                    key={mentee._id}
                                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                        formData.assignedMentees.includes(mentee._id)
                                                            ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                                                    }`}
                                                    onClick={() => toggleMenteeSelection(mentee._id)}
                                                >
                                                    <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center border ${
                                                        formData.assignedMentees.includes(mentee._id)
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {formData.assignedMentees.includes(mentee._id) && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{mentee.user.name}</div>
                                                        <div className="text-sm text-gray-500">{mentee.user.email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {formData.assignedMentees.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {formData.assignedMentees.map(id => {
                                    const mentee = mentees.find(m => m._id === id);
                                    return mentee && (
                                        <div key={id} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm flex items-center border border-blue-100">
                                            {mentee.user.name}
                                            <button
                                                type="button"
                                                onClick={() => toggleMenteeSelection(id)}
                                                className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center px-8 py-3 rounded-lg text-white font-medium shadow-md transition-all duration-200 cursor-pointer ${
                                isSubmitting 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1'
                            }`}
                        >
                            <Save className="mr-2" size={18} />
                            {isSubmitting ? 'Creating Exam...' : 'Create Exam'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateExam;