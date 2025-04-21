import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useTranslation } from "react-i18next";

const AIProjectRecommendations = () => {
  const { t } = useTranslation();
  const [selectedDomain, setSelectedDomain] = useState(t("projects.filter.all"));
  const [projectRecommendations, setProjectRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Get unique domains for filtering
  const domains = [
    t("projects.filter.all"), 
    ...new Set(projectRecommendations.map(project => project.domain))
  ];

  // Filter projects based on selected domain
  const filteredProjects = selectedDomain === t("projects.filter.all")
    ? projectRecommendations
    : projectRecommendations.filter(project => project.domain === selectedDomain);

  async function fetchRecommendations() {
    if (!user) {
      console.error(t("projects.errors.notLoggedIn"));
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        "https://athenai-backendonly.onrender.com/recommendations/",
        { "user_id": user._id },
        { withCredentials: true }
      );
      
      const updatedData = response.data.responses.map(item => ({
        ...item,
        domain: item.domain
      }));
      
      setProjectRecommendations(updatedData);
    } catch (error) {
      console.error(t("projects.errors.fetchFailed"), error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen md:p-8 px-6 py-3 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-2">
          {t("projects.title")}
        </h1>
        <p className="text-gray-600 mb-4">
          {t("projects.subtitle")}
        </p>
        
        {/* Fetch Recommendations Button */}
        <div className="mb-6">
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("projects.buttons.loading")}
              </>
            ) : (
              t("projects.buttons.getRecommendations")
            )}
          </button>
        </div>

        {/* Domain Filter */}
        {projectRecommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {t("projects.filter.title")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {domains.map(domain => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedDomain === domain
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">
              {t("projects.loading")}
            </p>
          </div>
        ) : projectRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id || index}
                className="bg-white rounded-xl md:p-6 px-3 py-2 shadow-sm transition-all duration-300 border border-gray-100 hover:shadow-md"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {project.domain}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h2>
                <p className="text-gray-600 mb-4 text-sm">{project.description}</p>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-900 my-2">
                    {t("projects.featuresTitle")}
                  </h3>
                  <ul className="space-y-4">
                    {project.key_features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 mr-2">
                          ✓
                        </span>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {t("projects.empty.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("projects.empty.message")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProjectRecommendations;