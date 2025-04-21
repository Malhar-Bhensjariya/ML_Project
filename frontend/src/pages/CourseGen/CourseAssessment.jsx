import React, { useState, useEffect } from "react";
import ExamCardItem from "../../components/assessment/ExamCardItem";
import QuestionNavigation from "../../components/assessment/QuestionNavigation";
import ResultScreen from "../../components/assessment/ResultScreen";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useTranslation } from "react-i18next";

const CourseAssessment = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const { user } = useUser();
  const location = useLocation();
  const NODE_API = import.meta.env.VITE_NODE_API;
  const { topic, skills, difficultyLevel } = location.state || {};

  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [examId, setExamId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateCourseEndAssessment = async () => {
      try {
        const res = await axios.post(
          `${NODE_API}/assessment/${courseId}/course-end-assessment`,
          {
            userId: user._id,
            topic,
            courseId,
            skills,
            difficultyLevel,
          }
        );
        setQuiz(res.data.questions);
        setExamId(res.data._id);
      } catch (error) {
        console.error(t("assessment.errors.generateFailed"), error);
      } finally {
        setLoading(false);
      }
    };

    generateCourseEndAssessment();
  }, [courseId, topic, skills, difficultyLevel, user._id, t]);


  const handleAnswer = (selectedOption) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion]: selectedOption,
    });
  };

  const navigateToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    return totalScore * 10;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setShowResults(true);
    if (!examId) {
      console.error("Missing examId, cannot update score");
      return;
    }
    try {
      await axios.patch(`${NODE_API}/assessment/${examId}`, {
        score: finalScore,
      });
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const restartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
  };

  if (quiz.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-600 font-medium">Generating assessment...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-600 font-medium">{t("assessment.loading")}</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <ResultScreen
        score={score}
        totalQuestions={quiz.length}
        onRestart={restartQuiz}
        userAnswers={userAnswers}
        quiz={quiz}
      />
    );
  }

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 max-w-screen min-w-screen p-6">
      <div className="w-full h-full">
        <h1 className="text-center font-bold text-4xl tracking-tight text-indigo-800 mb-2">
          {t("assessment.title")}
        </h1>
        <p className="text-center text-indigo-600 mb-10">
          {t("assessment.subtitle")}
        </p>

        <div className="flex justify-center items-center flex-col lg:flex-row gap-8 min-w-full max-w-full h-full">
          <div className="lg:order-1 order-2 flex-grow bg-white rounded-2xl shadow-xl p-6 w-10/12 h-1/4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <span className="flex items-center justify-center w-10 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg">
                  {currentQuestion + 1}
                </span>
                <div className="ml-4">
                  <h2 className="font-bold text-lg text-gray-700">
                    {t("assessment.questionLabel")} {currentQuestion + 1}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t("assessment.ofQuestions")} {quiz.length} {t("assessment.questions")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <ExamCardItem
                quiz={quiz[currentQuestion]}
                userSelectedOption={handleAnswer}
                selectedOption={userAnswers[currentQuestion] || null}
              />
            </div>

            <div className="flex justify-between mt-1">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentQuestion === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-indigo-600 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {t("assessment.buttons.previous")}
              </button>

              {currentQuestion === quiz.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                >
                  {t("assessment.buttons.submit")}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                >
                  {t("assessment.buttons.next")}
                </button>
              )}
            </div>
          </div>

          <div className="lg:order-2 order-1 lg:w-64 bg-gray-900 rounded-2xl shadow-xl p-6 w-2/12">
            <h3 className="font-bold text-lg mb-4 text-white">
              {t("assessment.questionsTitle")}
            </h3>
            <QuestionNavigation
              totalQuestions={quiz.length}
              currentQuestion={currentQuestion}
              answeredQuestions={userAnswers}
              onQuestionClick={navigateToQuestion}
            />
            <div className="mt-6 pt-5 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  {t("assessment.progress")}
                </span>
                <span className="text-sm font-medium text-indigo-400">
                  {Object.keys(userAnswers).length} / {quiz.length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${(Object.keys(userAnswers).length / quiz.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAssessment;