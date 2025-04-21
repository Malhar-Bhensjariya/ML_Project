import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ExamCardItem from "../../components/assessment/ExamCardItem";
import QuestionNavigation from "../../components/assessment/QuestionNavigation";
import ResultScreen from "../../components/assessment/ResultScreen";
import axios from "axios";
import { useParams } from "react-router-dom";

const Exam = () => {
  const { t } = useTranslation();
  const { examId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const NODE_API = import.meta.env.VITE_NODE_API;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${NODE_API}/assessment/${examId}`);
        setQuiz(res.data.questions);
      } catch (error) {
        console.error(t("errorFetchingQuestions"), error);
      }
    };
    fetchQuestions();
  }, [examId, t]);

  const handleAnswer = (selectedOption) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedOption });
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
    Object.keys(userAnswers).forEach((questionIndex) => {
      const index = parseInt(questionIndex);
      if (userAnswers[index] === quiz[index].answer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    return totalScore * 10;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setShowResults(true);
    try {
      await axios.patch(`${NODE_API}/assessment/${examId}`, { score: finalScore });
    } catch (error) {
      console.error(t("errorUpdatingScore"), error);
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
          <p className="text-indigo-600 font-medium">{t("loadingQuiz")}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 sm:p-6">
      <div className="w-full h-full">
        <h1 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-indigo-800 mb-2">
          {t("challengeQuiz")}
        </h1>
        <p className="text-center text-indigo-600 mb-4 sm:mb-10 text-sm sm:text-base">{t("quizDescription")}</p>

        <div className="flex justify-center items-center flex-col lg:flex-row gap-4 sm:gap-8 w-full h-full">
          {/* Question Navigation Panel - Moved to top on mobile */}
          <div className="lg:order-2 order-1 w-full lg:w-64 bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 overflow-hidden lg:sticky lg:top-6 lg:h-min mb-4 lg:mb-0">
            <h3 className="font-bold text-lg mb-2 sm:mb-4 text-gray-100">{t("questions")}</h3>
            <div className="mb-3 sm:mb-4 pt-1 pb-2 px-1 overflow-x-auto">
              <QuestionNavigation
                totalQuestions={quiz.length}
                currentQuestion={currentQuestion}
                answeredQuestions={userAnswers}
                onQuestionClick={navigateToQuestion}
              />
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-300">{t("progress")}</span>
                <span className="text-xs sm:text-sm font-medium text-indigo-400">
                  {Object.keys(userAnswers).length} / {quiz.length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(Object.keys(userAnswers).length / quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Quiz Area */}
          <div className="lg:order-1 order-2 flex-grow bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 transform transition-all duration-300 w-full">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              <div className="flex items-center">
                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-base sm:text-lg">
                  {currentQuestion + 1}
                </span>
                <div className="ml-2 sm:ml-4">
                  <h2 className="font-bold text-base md:text-lg text-gray-700">
                    {t("question")} {currentQuestion + 1}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t("of")} {quiz.length} {t("questions")}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="w-6 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
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

            <div className="flex justify-between mt-4 sm:mt-6 flex-wrap gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`cursor-pointer px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 flex items-center ${currentQuestion === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-indigo-600 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("previous")}
              </button>

              {currentQuestion === quiz.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t("submitQuiz")}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 outline-0 focus:ring-0 to-purple-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  {t("next")}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;