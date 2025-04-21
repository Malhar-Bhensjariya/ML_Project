import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import MenteeProfileForm from "../../components/misc/MenteeProfileForm";
import generateResume from "../../components/misc/generateResume";
import axios from "axios";
import {
  Edit2,
  BookOpen,
  Briefcase,
  Award,
  Target,
  User,
  Download,
} from "lucide-react";
import MentorScoresChart from '../../components/landing/MentorScoresCart';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const NODE_API = import.meta.env.VITE_NODE_API;

  console.log("User data:", user);
  async function load_flask() {
    try {
      const response = await axios.post("https://athenai-backendonly.onrender.com/recommendations/load-projects",
        { "user_id": user?._id }, { withCredentials: true });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      load_flask();
    }
  }, [user]);

  const handleUpdate = async (updatedData) => {
    try {
      if (!user?._id || !user?.token) {
        console.error("User ID or token missing");
        return;
      }

      const { data } = await axios.patch(`${NODE_API}/api/auth/profile/${user._id}`, updatedData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setUser(data.user); // Update the global user state using setUser
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded-md w-64 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-48 mx-auto"></div>
      </div>
    </div>
  );

  // Render mentor view if user is a mentor
  if (user?.userType === "Mentor") {
    return (
      <div>
        <MentorScoresChart />
      </div>
    );
  }

  const renderMenteeProfile = () => {
    const hasEducation = user?.education?.class10 || user?.education?.class12 || user?.education?.currentEducation;
    const hasSkills = user?.skills && user?.skills.length > 0;

    if (!hasEducation && !user?.extracurricular?.length && !user?.internships?.length && !hasSkills) {
      return (
        <div className="text-center py-16 glass-card rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-xl">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Your profile is incomplete. Let's create your professional profile to
            showcase your skills and achievements.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-8 rounded-xl font-medium shadow-lg"
          >
            Create Profile
          </motion.button>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:px-6 md:px-8 lg:px-12">
        {/* Skills Section */}
        {hasSkills && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
              <Award className="text-blue-500" size={24} />
              <span>Skills</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-sm"
                >
                  {skill.name || skill}
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {/* Career Goals Section */}
        {user?.careerGoals?.length > 0 && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
              <Target className="text-purple-500" size={24} />
              <span>Career Goals</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.careerGoals.map((goal, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-sm"
                >
                  {goal}
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {/* Academic Information */}
        {hasEducation && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
              <BookOpen className="text-blue-500" size={24} />
              <span>Academic Journey</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Class 10 */}
              {user?.education?.class10 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-lg">Class 10</h3>
                  <p className="text-gray-900 font-medium">{user.education.class10.school || "Not specified"}</p>
                  <p className="text-gray-600">
                    Percentage:{" "}
                    <span className="font-medium">{user.education.class10.percentage || "N/A"}%</span>
                  </p>
                  <p className="text-gray-600">
                    Year: <span className="font-medium">{user.education.class10.yearOfCompletion || "N/A"}</span>
                  </p>
                </motion.div>
              )}

              {/* Class 12 */}
              {user?.education?.class12 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white/60 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-lg">Class 12</h3>
                  <p className="text-gray-900 font-medium">{user.education.class12.school || "Not specified"}</p>
                  <p className="text-gray-600">
                    Percentage:{" "}
                    <span className="font-medium">{user.education.class12.percentage || "N/A"}%</span>
                  </p>
                  <p className="text-gray-600">
                    Year: <span className="font-medium">{user.education.class12.yearOfCompletion || "N/A"}</span>
                  </p>
                </motion.div>
              )}

              {/* Current Education */}
              {user?.education?.currentEducation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className={`${(!user?.education?.class10 || !user?.education?.class12) ? "md:col-span-2" : ""
                    } bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500`}
                >
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-lg">Current Education</h3>
                  <p className="text-gray-900 font-medium text-base sm:text-lg">
                    {user.education.currentEducation.institution || "Not specified"}
                  </p>
                  <p className="text-gray-700">
                    {user.education.currentEducation.course || "N/A"}
                    {user.education.currentEducation.specialization && (
                      <span> - {user.education.currentEducation.specialization}</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Year:</span>{" "}
                      {user.education.currentEducation.yearOfStudy || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">CGPA:</span>{" "}
                      {user.education.currentEducation.cgpa || "N/A"}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Experience & Achievements */}
        {(user?.extracurricular?.length > 0 || user?.internships?.length > 0 || user?.achievements?.length > 0) && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
              <Briefcase className="text-purple-500" size={24} />
              <span>Experience & Achievements</span>
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {/* Extracurricular Activities */}
              {user?.extracurricular?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-lg flex items-center gap-2">
                    <Award size={18} className="text-yellow-500" />
                    Extracurricular Activities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.extracurricular.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 sm:p-5 bg-white/70 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                      >
                        <h4 className="font-medium text-base sm:text-lg text-gray-800">{activity.activity}</h4>
                        <p className="text-gray-700 font-medium">{activity.role}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.duration}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{activity.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internships */}
              {user?.internships?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-lg flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-500" />
                    Internships
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.internships.map((internship, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all border border-indigo-100"
                      >
                        <h4 className="font-medium text-base sm:text-lg text-indigo-900">{internship.company}</h4>
                        <p className="text-indigo-700 font-medium">{internship.role}</p>
                        <p className="text-sm text-indigo-500 mt-1">{internship.duration}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{internship.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {user?.achievements?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-lg flex items-center gap-2">
                    <Award size={18} className="text-amber-500" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
                      >
                        <h4 className="font-medium text-base sm:text-lg text-amber-900">{achievement.title}</h4>
                        <p className="text-sm text-amber-600 mt-1">{achievement.year}</p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{achievement.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

    );
  };

  return (
    <div className="max-w-6xl mx-auto h-screen max-h-screen p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
      {/* Header with Cover Photo */}
      <div className="relative">
        <div className="w-full h-26 sm:h-38 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-14 sm:-mt-16 sm:ml-8 flex flex-col sm:flex-row items-start sm:items-end sm:justify-between px-4 sm:px-0">
          <div className="md:mb-6 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="sm:ml-6 mt-4 sm:mt-0 mb-4">
            <h1 className="text-2xl sm:text-4xl font-bold leading-8 sm:leading-9 text-white drop-shadow-md">
              {user.name}
            </h1>
            <p className="text-white/90 text-sm sm:text-base">{user.email}</p>
            <div className="mt-1">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm rounded-full">
                {user.userType || "Student"}
              </span>
            </div>
          </div>

          {user.userType === "Student" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 sm:mt-0 sm:ml-auto sm:mr-8 mb-4 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md sm:rounded-lg bg-white text-indigo-700 shadow-md hover:bg-indigo-50 transition-colors text-sm sm:text-base"
            >
              <Edit2 size={16} />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 sm:gap-8 md:px-4 px-0 sm:px-0">
        {user.userType === "Student" &&
          (isEditing ? (
            <MenteeProfileForm
              initialData={user}
              onComplete={handleUpdate}
            />
          ) : (
            <>
              {renderMenteeProfile()}

              {(user?.education || user?.extracurricular?.length || user?.internships?.length || user?.skills?.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-6 sm:mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generateResume(user)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download Resume
                  </motion.button>
                </motion.div>
              )}
            </>
          ))}
      </div>
    </div>

  );
};

export default ProfilePage;