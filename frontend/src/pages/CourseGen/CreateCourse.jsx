import React, { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import { IoMdOptions } from "react-icons/io";
import skillList from "../../data/skillList";
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";

const CreateCourse = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [apiResponse, setApiResponse] = useState({ courseLayout: [] });
  const [generatingCourse, setGeneratingCourse] = useState(false);
  const [generatingChapters, setGeneratingChapters] = useState(false);
  const NODE_API = import.meta.env.VITE_NODE_API;
  const { user } = useUser();
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: t("createCourse.steps.skills"), icon: HiOutlineSquare3Stack3D },
    { id: 2, name: t("createCourse.steps.topic"), icon: FiTarget },
    { id: 3, name: t("createCourse.steps.options"), icon: IoMdOptions },
    { id: 4, name: t("createCourse.steps.generated"), icon: FaWandMagicSparkles },
  ];

  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    difficulty: "",
    duration: "",
    noOfChp: "",
  });

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const isNextEnabled = () => {
    switch (step) {
      case 0: return skills.length > 0;
      case 1: return formData.topic.trim() && formData.description.trim();
      case 2: return (
        formData.difficulty &&
        formData.duration &&
        formData.noOfChp >= 1 &&
        formData.noOfChp <= 5
      );
      default: return false;
    }
  };

  const GenerateCourseLayout = async () => {
    setGeneratingCourse(true);
    try {
      const response = await fetch(`${NODE_API}/generate-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills }),
      });
  
      if (!response.ok) throw new Error(t("createCourse.errors.generateFailed"));
  
      const data = await response.json();
      setApiResponse(data);
      setStep(3);
      toast.success(t("createCourse.success.layoutGenerated"));
    } catch (error) {
      console.error(t("createCourse.errors.generateFailed"), error);
      toast.error(t("createCourse.errors.generateFailed"));
    } finally {
      setGeneratingCourse(false);
    }
  };

  const GenerateChapterContent = async () => {
    setGeneratingChapters(true);
    try {
        if (!apiResponse.courseLayout || !apiResponse.courseLayout.Chapters?.length) {
            toast.error(t("createCourse.errors.noChapters"));
            setGeneratingChapters(false);
            return;
        }

        const course = apiResponse.courseLayout;
        const updatedCourse = { ...course, Chapters: [...course.Chapters] };

        for (let i = 0; i < updatedCourse.Chapters.length; i++) {
            const chapter = updatedCourse.Chapters[i];

            const chapterPayload = {
                chapterName: chapter["Chapter Name"],
                about: chapter["About"],
                duration: chapter["Duration"],
                content: chapter["Content"],
                difficulty: course.Level,
            };

            try {
                const chapterResponse = await fetch(`${NODE_API}/generate-chapter-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(chapterPayload),
                });

                if (!chapterResponse.ok) {
                    throw new Error(t("createCourse.errors.chapterFailed", { chapter: chapter["Chapter Name"] }));
                }

                const { sections, video } = await chapterResponse.json();

                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections,
                    video: video ?? { url: null, thumbnail: null },
                };
            } catch (chapterError) {
                console.error(t("createCourse.errors.chapterError", { chapter: chapter["Chapter Name"] }), chapterError);
                toast.warning(t("createCourse.warnings.chapterSkipped", { chapter: chapter["Chapter Name"] }));
                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections: [],
                    video: { url: null, thumbnail: null },
                };
            }
        }

        const token = user?.token;
        if (!token) {
            toast.error(t("createCourse.errors.sessionExpired"));
            return;
        }

        const transformCourse = (course) => ({
            courseName: course["Course Name"],
            description: course["Description"],
            skills: course["Skills"],
            level: course["Level"],
            duration: course["Duration"],
            noOfChapters: course["NoOfChapters"],
            courseOutcomes: course["Course Outcomes"],
            chapters: course.Chapters.map(chapter => ({
                chapterName: chapter["Chapter Name"],
                about: chapter["About"],
                duration: chapter["Duration"],
                sections: chapter.sections,
                video: chapter.video ?? { url: null, thumbnail: null },
                isCompleted: chapter.isCompleted ?? false
            }))
        });

        const finalCourse = transformCourse(updatedCourse);

        try {
            const response = await axios.post(
                `${NODE_API}/courses/create-courses`,
                finalCourse,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success(t("createCourse.success.courseCreated"));
            const courseId = response.data?.course?._id;

            if (courseId) {
                if (user?.userType === 'Mentor') {
                    await createAssignedCourseForMentor(courseId);
                }

                navigate(`/course/${courseId}`);
            } else {
                toast.error(t("createCourse.errors.noCourseId"));
            }
        } catch (error) {
            console.error(t("createCourse.errors.createFailed"), error);
            if (error.response?.status === 401) {
                toast.error(t("createCourse.errors.sessionExpired"));
            } else {
                toast.error(t("createCourse.errors.saveFailed"));
            }
        }

    } catch (error) {
        console.error(t("createCourse.errors.generationFailed"), error);
        toast.error(t("createCourse.errors.generationFailed"));
    } finally {
        setGeneratingChapters(false);
    }
  };

  const createAssignedCourseForMentor = async (courseId) => {
    try {
        const assignedCoursePayload = {
            mentor: user._id,
            assigns: [],
            orgCourseId: courseId,
            dueDate: null
        };

        await axios.post(`${NODE_API}/assigned/`, assignedCoursePayload);
        toast.success(t("createCourse.success.assignedCreated"));
    } catch (error) {
        console.error(t("createCourse.errors.assignFailed"), error);
        toast.error(t("createCourse.errors.assignFailed"));
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto my-4 sm:my-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 text-center mb-4 sm:mb-6">
          {t("createCourse.title")}
        </h2>
  
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto px-2">
          {steps.map((stepItem, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-full ${step >= index ? "bg-purple-600 text-white" : "bg-gray-300"}`}>
                <stepItem.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              {index < steps.length - 1 && <div className={`w-8 sm:w-16 h-1 ${step > index ? "bg-purple-600" : "bg-gray-300"}`} />}
            </div>
          ))}
        </div>
  
        <div className="bg-gradient-to-br from-purple-50 to-white p-4 sm:p-8 rounded-xl shadow-lg">
          {step < 3 && (
            <>
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 sm:mb-4">
                    {t("createCourse.skills.title")}
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      placeholder={t("createCourse.skills.addPlaceholder")}
                      className="flex-grow p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      list="skillSuggestions"
                    />
                    <button
                      className="bg-purple-600 text-white p-2 sm:p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition duration-300"
                      disabled={!skillInput.trim()}
                      onClick={addSkill}
                    >
                      {t("createCourse.skills.addButton")}
                    </button>
                  </div>
                  <datalist id="skillSuggestions">
                    {skillList.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase())).map(skill => (
                      <option key={skill} value={skill} />
                    ))}
                  </datalist>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {skills.map(skill => (
                      <div 
                        key={skill} 
                        className="bg-purple-200 px-3 py-1 rounded-full flex items-center space-x-2 text-purple-800"
                      >
                        <span className="text-sm sm:text-base">{skill}</span>
                        <button 
                          className="text-red-500 hover:text-red-700 transition" 
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 sm:mb-4">
                    {t("createCourse.topic.title")}
                  </h3>
                  <input
                    type="text"
                    placeholder={t("createCourse.topic.topicPlaceholder")}
                    className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                  <textarea
                    placeholder={t("createCourse.topic.descriptionPlaceholder")}
                    className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              )}
  
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 sm:mb-4">
                    {t("createCourse.options.title")}
                  </h3>
                  <select
                    className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="">{t("createCourse.options.difficultyPlaceholder")}</option>
                    <option>{t("createCourse.options.difficulty.basic")}</option>
                    <option>{t("createCourse.options.difficulty.intermediate")}</option>
                    <option>{t("createCourse.options.difficulty.advanced")}</option>
                  </select>
                  <input
                    type="text"
                    placeholder={t("createCourse.options.durationPlaceholder")}
                    className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder={t("createCourse.options.chaptersPlaceholder")}
                    className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    value={formData.noOfChp}
                    min={1}
                    max={5}
                    onChange={(e) => setFormData({ ...formData, noOfChp: Number(e.target.value) })}
                  />
                </div>
              )}
            </>
          )}
  
          {step === 3 && apiResponse.courseLayout && Object.keys(apiResponse.courseLayout).length > 0 && (
            <div>
              {(() => {
                const course = apiResponse.courseLayout;
                return (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-purple-700">{course["Course Name"]}</h3>
                    
                    <div className="bg-purple-50 p-4 sm:p-6 rounded-xl border border-purple-100">
                      <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                        <strong>{t("createCourse.preview.description")}:</strong> {course.Description}
                      </p>
                      
                      <div className="mb-3 sm:mb-4">
                        <strong className="block mb-1 sm:mb-2 text-sm sm:text-base">{t("createCourse.preview.skills")}:</strong>
                        <div className="flex flex-wrap gap-2">
                          {course.Skills.map((skill, skillIdx) => (
                            <span 
                              key={skillIdx} 
                              className="bg-purple-200 px-2 sm:px-3 py-1 rounded-full text-purple-800 text-xs sm:text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                        <p><strong>{t("createCourse.preview.level")}:</strong> {course.Level}</p>
                        <p><strong>{t("createCourse.preview.duration")}:</strong> {course.Duration}</p>
                        <p><strong>{t("createCourse.preview.chapters")}:</strong> {course.NoOfChapters}</p>
                      </div>
                      
                      <div className="mt-3 sm:mt-4">
                        <strong className="block mb-1 sm:mb-2 text-sm sm:text-base">{t("createCourse.preview.outcomes")}:</strong>
                        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                          {course["Course Outcomes"].map((outcome, outcomeIdx) => (
                            <li key={outcomeIdx} className="text-gray-700">{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-purple-700">
                        {t("createCourse.preview.chaptersTitle")}
                      </h4>
                      {course.Chapters.map((chapter, chapterIdx) => (
                        <div 
                          key={chapterIdx} 
                          className="bg-white border border-purple-100 rounded-xl p-3 sm:p-5 mb-3 sm:mb-4 shadow-sm hover:shadow-md transition"
                        >
                          <h5 className="text-lg sm:text-xl font-semibold text-purple-600 mb-2">{chapter["Chapter Name"]}</h5>
                          <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">{chapter.About}</p>
                          <p className="mb-2 text-xs sm:text-sm">
                            <strong>{t("createCourse.preview.chapterDuration")}:</strong> {chapter.Duration}
                          </p>
                          <div>
                            <strong className="block mb-1 sm:mb-2 text-xs sm:text-sm">{t("createCourse.preview.content")}:</strong>
                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                              {chapter.Content.map((item, contentIdx) => (
                                <li key={contentIdx} className="text-gray-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
  
        <div className="mt-4 sm:mt-6 flex flex-row justify-between items-center gap-2 md:p-0 px-3">
          <div>
            {step === 0 && (
              <button 
                onClick={() => navigate('/my-courses')} 
                className="w-full sm:w-auto p-2 bg-gray-600 text-white rounded cursor-pointer text-sm sm:text-base"
              >
                {t("createCourse.buttons.backToCourses")}
              </button>
            )}
            {step > 0 && step < 3 && (
              <button 
                onClick={() => setStep(step - 1)} 
                className="w-full sm:w-auto p-2 bg-gray-300 rounded text-sm sm:text-base"
              >
                {t("createCourse.buttons.back")}
              </button>
            )}
          </div>
          
          <div>
            {step === 2 && (
              <button 
                onClick={GenerateCourseLayout} 
                disabled={generatingCourse}
                className={`w-full sm:w-auto p-2 bg-black text-white rounded flex items-center justify-center sm:justify-start ${generatingCourse ? 'opacity-50 cursor-not-allowed' : ''} text-sm sm:text-base`}
              >
                {generatingCourse ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    {t("createCourse.buttons.generating")}
                  </>
                ) : (
                  t("createCourse.buttons.generate")
                )}
              </button>
            )}
            
            {step === 3 && (
              <button 
                onClick={GenerateChapterContent} 
                disabled={generatingChapters}
                className={`w-full sm:w-auto p-2 rounded flex items-center justify-center sm:justify-start text-sm sm:text-base ${
                  !generatingChapters
                    ? "bg-green-600 text-white" 
                    : "bg-green-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {generatingChapters ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    {t("createCourse.buttons.finalizing")}
                  </>
                ) : (
                  t("createCourse.buttons.finish")
                )}
              </button>
            )}
            
            {(step === 0 || step === 1) && (
              <button 
                onClick={() => setStep(step + 1)} 
                className="w-full sm:w-auto p-2 bg-green-700 text-white rounded text-sm sm:text-base" 
                disabled={!isNextEnabled()}
              >
                {t("createCourse.buttons.next")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;