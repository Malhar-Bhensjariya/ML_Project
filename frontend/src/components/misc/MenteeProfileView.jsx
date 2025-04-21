import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, BookOpen, Briefcase, Award, Target, ArrowLeft } from 'lucide-react';

const MenteeProfileView = ({ profile, onEdit, onBack }) => {
    console.log(profile);
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 student-dashboard min-h-screen">
            {/* Profile Header */}
            <div className="flex justify-between items-start">
                {/* <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </motion.button>
                    <h1 className="text-3xl font-bold bg-blue-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                </div> */}
                {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-button text-white"
                >
                    <Edit2 size={18} />
                    Edit Profile
                </motion.button> */}
            </div>

            {/* Academic Information */}
            <section className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="text-blue-500" />
                    Academic Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Class 10 */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Class 10</h3>
                        <p className="text-gray-900">{profile?.academics?.class10?.school}</p>
                        <p className="text-gray-600">Percentage: {profile?.academics?.class10?.percentage}%</p>
                        <p className="text-gray-600">Year: {profile?.academics?.class10?.yearOfCompletion}</p>
                    </div>

                    {/* Class 12 */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Class 12</h3>
                        <p className="text-gray-900">{profile?.academics?.class12.school}</p>
                        <p className="text-gray-600">Percentage: {profile?.academics?.class12.percentage}%</p>
                        <p className="text-gray-600">Year: {profile?.academics?.class12.yearOfCompletion}</p>
                    </div>

                    {/* Current Education */}
                    <div className="md:col-span-2">
                        <h3 className="font-medium text-gray-700 mb-2">Current Education</h3>
                        <p className="text-gray-900">{profile?.academics?.currentEducation?.institution}</p>
                        <p className="text-gray-600">
                            {profile?.academics?.currentEducation?.course} - {profile?.academics?.currentEducation?.specialization}
                        </p>
                        <p className="text-gray-600">
                            Year: {profile?.academics?.currentEducation?.yearOfStudy} | CGPA: {profile?.academics?.currentEducation?.cgpa}
                        </p>
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Briefcase className="text-purple-500" />
                    Experience
                </h2>

                {/* Extracurricular Activities */}
                {profile?.extracurricular?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-4">Extracurricular Activities</h3>
                        <div className="space-y-4">
                            {profile.extracurricular.map((activity, index) => (
                                <div key={index} className="p-4 bg-white/50 rounded-lg">
                                    <h4 className="font-medium">{activity?.activity}</h4>
                                    <p className="text-gray-600">{activity?.role}</p>
                                    <p className="text-sm text-gray-500">{activity?.duration}</p>
                                    <p className="text-sm text-gray-600 mt-2">{activity?.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Internships */}
                {profile?.internships?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-4">Internships</h3>
                        <div className="space-y-4">
                            {profile.internships.map((internship, index) => (
                                <div key={index} className="p-4 bg-white/50 rounded-lg">
                                    <h4 className="font-medium">{internship.company}</h4>
                                    <p className="text-gray-600">{internship.role}</p>
                                    <p className="text-sm text-gray-500">{internship.duration}</p>
                                    <p className="text-sm text-gray-600 mt-2">{internship.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {profile?.achievements?.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700 mb-4">Achievements</h3>
                        <div className="space-y-4">
                            {profile.achievements.map((achievement, index) => (
                                <div key={index} className="p-4 bg-white/50 rounded-lg">
                                    <h4 className="font-medium">{achievement.title}</h4>
                                    <p className="text-sm text-gray-500">Year: {achievement.year}</p>
                                    <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Future Goals */}
            <section className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Target className="text-green-500" />
                    Future Goals
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Short Term Goals</h3>
                        <p className="text-gray-600">{profile.futureGoals.shortTerm}</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Long Term Goals</h3>
                        <p className="text-gray-600">{profile.futureGoals.longTerm}</p>
                    </div>
                    {profile?.futureGoals?.dreamCompanies?.length > 0 && (
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Dream Companies</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.futureGoals.dreamCompanies.map((company, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {company}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MenteeProfileView;