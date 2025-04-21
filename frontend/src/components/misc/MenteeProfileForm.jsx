import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    Loader2,
    CheckCircle,
    Award,
    Briefcase,
    Target,
    School,
    User,
    Bookmark,
    ArrowRight,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ActivityCard from './ActivityCard';

const MenteeProfileForm = ({ initialData = {} }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        academics: {
            class10: { school: '', percentage: '', yearOfCompletion: '' },
            class12: { school: '', percentage: '', yearOfCompletion: '' },
            currentEducation: {
                institution: '', course: '', specialization: '',
                yearOfStudy: '', cgpa: ''
            }
        },
        hasExtracurricular: false,
        extracurricular: [],
        hasInternships: false,
        internships: [],
        hasAchievements: false,
        achievements: [],
        futureGoals: {
            shortTerm: '',
            longTerm: '',
            dreamCompanies: []
        },
        ...initialData
    });
    const [newSkill, setNewSkill] = useState('');
    const [newDreamCompany, setNewDreamCompany] = useState('');
    const [errors, setErrors] = useState({});
    const NODE_API = import.meta.env.VITE_NODE_API;

    const STEPS = [
        { id: 1, label: 'Academics', icon: <School size={20} /> },
        { id: 2, label: 'Experience', icon: <Briefcase size={20} /> },
        { id: 3, label: 'Goals', icon: <Target size={20} /> }
    ];

    useEffect(() => {
        // Fetch initial data if needed
        // This would replace the need for initialData prop in a real implementation
    }, []);

    const validateStep = (stepNumber) => {
        const newErrors = {};
        switch (stepNumber) {
            case 1: // Academics
                if (!formData.academics.class10.school || !formData.academics.class10.percentage) {
                    newErrors.class10 = 'Class 10 details are required';
                }
                if (!formData.academics.class12.school || !formData.academics.class12.percentage) {
                    newErrors.class12 = 'Class 12 details are required';
                }
                if (!formData.academics.currentEducation.institution) {
                    newErrors.currentEducation = 'Current education details are required';
                }
                break;
            case 2: // Experience
                // Optional sections, no validation needed
                break;
            case 3: // Goals
                if (!formData.futureGoals.shortTerm) {
                    newErrors.shortTerm = 'Short term goals are required';
                }
                if (!formData.futureGoals.longTerm) {
                    newErrors.longTerm = 'Long term goals are required';
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${NODE_URL}/auth/profile`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            toast.success('Profile updated successfully!');
            // Redirect or show success screen
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };
    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prevStep) => Math.min(prevStep + 1, STEPS.length));
        }
    };

    const handlePrevious = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1));
    };
    const handleAddItem = (type) => {
        const newItems = {
            extracurricular: { activity: '', role: '', duration: '', description: '' },
            internships: { company: '', role: '', duration: '', description: '' },
            achievements: { title: '', year: new Date().getFullYear(), description: '' }
        };

        setFormData({
            ...formData,
            [type]: [...formData[type], newItems[type]]
        });
    };

    const handleDeleteItem = (type, index) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter((_, i) => i !== index)
        });
    };

    const handleUpdateItem = (type, index, updatedItem) => {
        const newItems = [...formData[type]];
        newItems[index] = updatedItem;
        setFormData({
            ...formData,
            [type]: newItems
        });
    };

    const handleAddDreamCompany = () => {
        if (newDreamCompany && !formData.futureGoals.dreamCompanies.includes(newDreamCompany)) {
            setFormData({
                ...formData,
                futureGoals: {
                    ...formData.futureGoals,
                    dreamCompanies: [...formData.futureGoals.dreamCompanies, newDreamCompany]
                }
            });
            setNewDreamCompany('');
        }
    };

    const handleRemoveDreamCompany = (index) => {
        setFormData({
            ...formData,
            futureGoals: {
                ...formData.futureGoals,
                dreamCompanies: formData.futureGoals.dreamCompanies.filter((_, i) => i !== index)
            }
        });
    };

    const renderAcademicForm = () => (
        <motion.div
            key="academics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <School size={24} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Academic Information
                </h2>
            </div>

            {/* Class 10 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                        10
                    </div>
                    Class 10 Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={formData.academics.class10.school}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class10: {
                                        ...formData.academics.class10,
                                        school: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter school name"
                        />
                        {errors.class10 && (
                            <p className="text-red-500 text-sm mt-1">{errors.class10}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            value={formData.academics.class10.percentage}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class10: {
                                        ...formData.academics.class10,
                                        percentage: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="Enter percentage"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                        <input
                            type="number"
                            value={formData.academics.class10.yearOfCompletion}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class10: {
                                        ...formData.academics.class10,
                                        yearOfCompletion: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="Enter year"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>

            {/* Class 12 Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                        12
                    </div>
                    Class 12 Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={formData.academics.class12.school}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class12: {
                                        ...formData.academics.class12,
                                        school: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="Enter school name"
                        />
                        {errors.class12 && (
                            <p className="text-red-500 text-sm mt-1">{errors.class12}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            value={formData.academics.class12.percentage}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class12: {
                                        ...formData.academics.class12,
                                        percentage: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="Enter percentage"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                        <input
                            type="number"
                            value={formData.academics.class12.yearOfCompletion}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class12: {
                                        ...formData.academics.class12,
                                        yearOfCompletion: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="Enter year"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>

            {/* Current Education Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Bookmark size={14} />
                    </div>
                    Current Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.institution}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        institution: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="Enter institution name"
                        />
                        {errors.currentEducation && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentEducation}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.course}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        course: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="e.g., B.Tech, BCA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.specialization}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        specialization: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                        <select
                            value={formData.academics.currentEducation.yearOfStudy}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        yearOfStudy: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none  md:text-md text-xs"
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                        <input
                            type="number"
                            value={formData.academics.currentEducation.cgpa}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        cgpa: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter CGPA"
                            min="0"
                            max="10"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderExperienceForm = () => (
        <motion.div
            key="experience"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Briefcase size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Experience & Activities
                </h2>
            </div>

            {/* Extracurricular Activities */}
            <ExperienceSection
                title="Extracurricular Activities"
                icon={<Award size={20} className="text-purple-500" />}
                hasItems={formData.hasExtracurricular}
                items={formData.extracurricular}
                type="extracurricular"
                onToggle={(checked) => setFormData({
                    ...formData,
                    hasExtracurricular: checked,
                    extracurricular: checked ? formData.extracurricular : []
                })}
                onAdd={() => handleAddItem('extracurricular')}
                onDelete={(index) => handleDeleteItem('extracurricular', index)}
                onUpdate={(index, item) => handleUpdateItem('extracurricular', index, item)}
                fields={[
                    { name: 'activity', label: 'Activity Name', type: 'text' },
                    { name: 'role', label: 'Your Role', type: 'text' },
                    { name: 'duration', label: 'Duration', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' }
                ]}
            />

            {/* Internships */}
            <ExperienceSection
                title="Internships"
                icon={<Briefcase size={20} className="text-blue-500" />}
                hasItems={formData.hasInternships}
                items={formData.internships}
                type="internships"
                onToggle={(checked) => setFormData({
                    ...formData,
                    hasInternships: checked,
                    internships: checked ? formData.internships : []
                })}
                onAdd={() => handleAddItem('internships')}
                onDelete={(index) => handleDeleteItem('internships', index)}
                onUpdate={(index, item) => handleUpdateItem('internships', index, item)}
                fields={[
                    { name: 'company', label: 'Company Name', type: 'text' },
                    { name: 'role', label: 'Your Role', type: 'text' },
                    { name: 'duration', label: 'Duration', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' }
                ]}
            />

            {/* Achievements */}
            <ExperienceSection
                title="Achievements"
                icon={<Award size={20} className="text-yellow-500" />}
                hasItems={formData.hasAchievements}
                items={formData.achievements}
                type="achievements"
                onToggle={(checked) => setFormData({
                    ...formData,
                    hasAchievements: checked,
                    achievements: checked ? formData.achievements : []
                })}
                onAdd={() => handleAddItem('achievements')}
                onDelete={(index) => handleDeleteItem('achievements', index)}
                onUpdate={(index, item) => handleUpdateItem('achievements', index, item)}
                fields={[
                    { name: 'title', label: 'Achievement Title', type: 'text' },
                    { name: 'year', label: 'Year', type: 'number' },
                    { name: 'description', label: 'Description', type: 'textarea' }
                ]}
            />
        </motion.div>
    );

    const renderGoalsForm = () => (
        <motion.div
            key="goals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Target size={24} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Future Goals
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                {/* Short Term Goals */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Target size={14} />
                        </div>
                        Short Term Goals
                        <span className="text-sm font-normal text-gray-500">(Next 1-2 years)</span>
                    </label>
                    <textarea
                        value={formData.futureGoals.shortTerm}
                        onChange={(e) => setFormData({
                            ...formData,
                            futureGoals: {
                                ...formData.futureGoals,
                                shortTerm: e.target.value
                            }
                        })}
                        className="w-full p-4 rounded-lg min-h-[120px] bg-gray-50 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 outline-none md:text-md text-sm"
                        placeholder="Describe your short term goals..."
                    />
                    {errors.shortTerm && (
                        <p className="text-red-500 text-sm mt-1">{errors.shortTerm}</p>
                    )}
                </div>

                {/* Long Term Goals */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Target size={14} />
                        </div>
                        Long Term Goals
                        <span className="text-sm font-normal text-gray-500">(5+ years)</span>
                    </label>
                    <textarea
                        value={formData.futureGoals.longTerm}
                        onChange={(e) => setFormData({
                            ...formData,
                            futureGoals: {
                                ...formData.futureGoals,
                                longTerm: e.target.value
                            }
                        })}
                        className="w-full p-4 rounded-lg min-h-[120px] bg-gray-50 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 outline-none md:text-md text-sm"
                        placeholder="Describe your long term goals..."
                    />
                    {errors.longTerm && (
                        <p className="text-red-500 text-sm mt-1">{errors.longTerm}</p>
                    )}
                </div>

                {/* Dream Companies */}
                <div>
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Briefcase size={14} />
                        </div>
                        Dream Companies
                    </label>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.futureGoals.dreamCompanies.map((company, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm md:text-md text-xs"
                            >
                                {company}
                                <button
                                    onClick={() => handleRemoveDreamCompany(index)}
                                    className="hover:text-red-500 transition-colors duration-200"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDreamCompany}
                            onChange={(e) => setNewDreamCompany(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddDreamCompany()}
                            className="flex-1 md:text-md text-xs md:p-3 pl-1 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 outline-none w-3/4"
                            placeholder="Add a dream company"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddDreamCompany}
                            className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <Plus size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return renderAcademicForm();
            case 2:
                return renderExperienceForm();
            case 3:
                return renderGoalsForm();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-indigo-50 pt-8 pb-16">
            <div className="max-w-4xl mx-auto md:px-4">
                {/* Profile Header */}
                <div className="mb-8 bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="md:h-28 h-20 bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 relative">
                        <div className="absolute inset-0 bg-pattern opacity-20"></div>
                    </div>

                    <div className="md:px-8 px-4 py-6 flex flex-col md:flex-row md:items-center gap-6 relative">
                        {/* Avatar Container */}
                        <div className="absolute -top-14 left-8 bg-white p-2 rounded-2xl shadow-xl">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white transition-transform duration-300 hover:scale-105">
                                <User size={36} />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="md:ml-24 pt-6 md:pt-0">
                            <h1 className="md:text-3xl text-xl font-bold text-gray-800 px-3">Your Profile</h1>
                            <p className="text-gray-500 mt-1 text-sm md:text-md">Complete your profile to connect with mentors</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="ml-auto hidden md:flex items-center gap-1">
                            {[1, 2, 3].map((stepNumber) => (
                                <div
                                    key={stepNumber}
                                    className={`md:w-3 md:h-3 rounded-full transition-all duration-300 ${stepNumber === step
                                        ? "bg-indigo-600 w-8"
                                        : stepNumber < step
                                            ? "bg-indigo-400"
                                            : "bg-gray-200"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Step Labels */}
                    <div className="md:px-8 px-4 pb-4 text-sm font-medium">
                        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-between">
                            <span
                                className={`transition-colors duration-300 ${step === 1 ? "text-indigo-600" : "text-gray-400"
                                    }`}
                            >
                                Academic Details
                            </span>
                            <span
                                className={`transition-colors duration-300 ${step === 2 ? "text-indigo-600" : "text-gray-400"
                                    }`}
                            >
                                Experience
                            </span>
                            <span
                                className={`transition-colors duration-300 ${step === 3 ? "text-indigo-600" : "text-gray-400"
                                    }`}
                            >
                                Future Goals
                            </span>
                        </div>
                    </div>

                </div>

                {/* Form Content */}
                <div className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    {/* Mobile Progress Indicator */}
                    <div className="flex items-center gap-2 mb-6 md:hidden">
                        {[1, 2, 3].map((stepNumber) => (
                            <div
                                key={stepNumber}
                                className={`h-1.5 rounded-full transition-all duration-300 ${stepNumber === step
                                    ? "bg-indigo-600 flex-grow"
                                    : stepNumber < step
                                        ? "bg-indigo-400 flex-grow"
                                        : "bg-gray-200 flex-grow"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Step Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {step === 1 && "Academic Journey"}
                        {step === 2 && "Professional Experience"}
                        {step === 3 && "Career Aspirations"}
                    </h2>

                    {/* Dynamic Form Content */}
                    <div className="transition-all duration-500 animate-fadeIn">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between md:mt-10 pt-6 border-t border-gray-100">
                        <button
                            onClick={handlePrevious}
                            disabled={step === 1}
                            className={`flex items-center md:gap-2 gap-1 px-0 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 md:text-xl text-xs${step === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-indigo-600 hover:bg-indigo-50"
                                }`}
                        >
                            <ArrowLeft size={18} />
                            Previous
                        </button>

                        <button
                            onClick={step === 3 ? handleSubmit : handleNext}
                            className="flex items-center md:gap-2 gap-1 md:px-8 px-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 md:text-lg text-xs"
                        >
                            {step === 3 ? "Complete Profile" : "Continue"}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );



    {/* Form Content */ }



};



const ExperienceSection = ({ title, icon, hasItems, items, type, onToggle, onAdd, onDelete, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-md border border-white/30 
        shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 rounded-2xl overflow-hidden"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5 gap-3">
                <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600">
                        {icon}
                    </div>
                    <p className="md:text-xl text-md">{title}</p>
                </h3>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <span className="text-sm font-medium text-gray-500">
                        Include {title.toLowerCase()}?
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={hasItems}
                            onChange={(e) => onToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
        peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full 
        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r 
        from-indigo-500 to-purple-500 shadow-sm"
                        ></div>
                    </label>

                    {hasItems && items.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                        >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </motion.button>
                    )}
                </div>
            </div>


            {hasItems && (
                <motion.div
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    className="space-y-4 overflow-hidden"
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <ActivityCard
                                data={item}
                                type={type}
                                onDelete={() => onDelete(index)}
                                onChange={(updated) => onUpdate(index, updated)}
                            />
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: items.length * 0.1 }}
                    >
                        <AddButton onClick={onAdd} text={`Add ${title.slice(0, -1)}`} />
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

const AddButton = ({ onClick, text }) => (
    <motion.button
        whileHover={{
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
            borderColor: "rgba(99, 102, 241, 0.8)"
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-indigo-600 
      hover:border-indigo-400 transition-all flex items-center justify-center gap-2 
      bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-100/80 
      hover:to-purple-100/80 font-medium mt-4"
    >
        <div className="p-1 rounded-full bg-indigo-100">
            <Plus size={18} />
        </div>
        {text}
    </motion.button>
);

export default MenteeProfileForm;