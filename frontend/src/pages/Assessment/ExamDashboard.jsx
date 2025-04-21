import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Clock,
  BookOpen,
  RefreshCw,
  Target,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const ExamDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useTranslation();
  const NODE_API = import.meta.env.VITE_NODE_API;

  // State for generating new assessment
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  // State for past assessments
  const [assessments, setAssessments] = useState([]);
  const [isAssessmentsLoading, setIsAssessmentsLoading] = useState(false);

  // Fetch user assessments
  const fetchAssessments = async () => {
    if (!user?._id) return;

    setIsAssessmentsLoading(true);
    try {
      const res = await axios.get(
        `${NODE_API}/assessment/getassess/${user._id}`
      );
      setAssessments(res.data);
    } catch (error) {
      console.error(t("errorFetchingAssessments"), error);
    } finally {
      setIsAssessmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user?._id]);

  // Generate new assessment
  const generateAssessment = async () => {
    if (!topic.trim()) {
      alert(t("enterTopicPlaceholder"));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${NODE_API}/assessment/generate`,
        {
          userId: user?._id,
          topic,
        }
      );
      const examId = res.data._id;
      navigate(`/assessment/${examId}`);
    } catch (error) {
      console.error(t("errorGeneratingAssessment"), error);
    } finally {
      setLoading(false);
      fetchAssessments(); // Refresh assessments list
    }
  };

  // Reattempt assessment
  const reattemptAssessment = (examId) => {
    navigate(`/assessment/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Assessment Generation Section */}
        <div className="md:col-span-1 bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border border-blue-50 p-5 md:p-8 transform transition-all hover:shadow-2xl">
          <div className="text-center mb-4 md:mb-6">
            <div className="inline-block bg-blue-100 p-2 md:p-3 rounded-full mb-3 md:mb-4">
              <Target className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
              {t("generateTest")}
            </h2>
            <p className="text-sm md:text-base text-gray-500">{t("createPersonalizedAssessment")}</p>
          </div>
          <div className="space-y-3 md:space-y-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("enterTopicPlaceholder")}
              className="w-full p-3 md:p-4 border-2 border-blue-100 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400 text-sm md:text-base"
              disabled={loading}
            />
            <button
              onClick={generateAssessment}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg md:rounded-xl font-bold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer text-sm md:text-base"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 md:h-6 md:w-6 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
              ) : (
                <>
                  <Sparkles className="group-hover:rotate-45 transition-transform" size={20} />
                  <span>{t("generateNewAssessment")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Past Assessments Section */}
        <div className="md:col-span-2 bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border border-blue-50 p-5 md:p-8 mt-6 md:mt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <div>
              <div className="inline-block bg-blue-100 p-2 md:p-3 rounded-full mb-2">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t("yourAssessments")}
              </h2>
              <p className="text-sm md:text-base text-gray-500">{t("trackLearningProgress")}</p>
            </div>
            {assessments.length > 0 && (
              <div className="flex items-center text-blue-600 font-semibold mt-2 sm:mt-0 text-sm md:text-base">
                <TrendingUp className="mr-2" size={20} />
                {assessments.length} {t("totalTests")}
              </div>
            )}
          </div>

          {isAssessmentsLoading ? (
            <div className="flex justify-center items-center h-48 md:h-64">
              <div className="animate-pulse">
                <svg className="h-12 w-12 md:h-16 md:w-16 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center bg-blue-50 rounded-lg md:rounded-xl p-6 md:p-10">
              <div className="inline-block bg-blue-100 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <p className="text-lg md:text-xl text-gray-700 mb-1 md:mb-2">{t("noAssessmentsYet")}</p>
              <p className="text-sm md:text-base text-gray-500">{t("startLearningJourney")}</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="bg-blue-50 rounded-lg md:rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-blue-100 transition-colors group"
                >
                  <div className="mb-3 sm:mb-0">
                    <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-1">
                      {assessment.topic}
                    </h3>
                    <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-600">
                      <Clock className="mr-1 md:mr-2" size={14} />
                      {new Date(assessment.createdAt).toLocaleDateString()}
                      <span className="ml-2 md:ml-4 bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                        {t("score")}: {assessment.score}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => reattemptAssessment(assessment._id)}
                    className="w-full sm:w-auto px-4 md:px-5 py-2 md:py-2.5 bg-blue-500 text-white rounded-md md:rounded-lg hover:bg-blue-600 flex items-center justify-center sm:justify-start group-hover:translate-x-0 sm:group-hover:translate-x-1 transition-transform cursor-pointer text-xs md:text-sm"
                  >
                    <RefreshCw className="mr-1 md:mr-2" size={14} />
                    {t("reattemptTest")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;
