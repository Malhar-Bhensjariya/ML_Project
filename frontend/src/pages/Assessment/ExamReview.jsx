import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ExamReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Retrieve userAnswers and quiz from state
  const { userAnswers = [], quiz = [] } = location.state || {};

  // Calculate overall score
  const calculateScore = () => {
    if (!quiz.length) return { correct: 0, total: 0, percentage: 0 };
    
    const correctAnswers = quiz.reduce((count, question, index) => {
      return count + (userAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    
    return {
      correct: correctAnswers,
      total: quiz.length,
      percentage: Math.round((correctAnswers / quiz.length) * 100)
    };
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800 border-b pb-4">
        {t("examReview.title")}
      </h2>
      
      {/* Score summary card */}
      <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-indigo-700">
            {t("examReview.yourScore")}
          </h3>
          <p className="text-gray-700 mt-1">
            {t("examReview.scoreSummary", {
              correct: score.correct,
              total: score.total
            })}
          </p>
        </div>
        <div className="text-4xl p-5 font-bold text-indigo-700">
          {score.percentage}%
        </div>
      </div>

      {quiz.length > 0 ? (
        <div className="space-y-6">
          {quiz.map((question, index) => {
            const userSelected = userAnswers[index];
            const isAttempted = userSelected !== undefined;
            const isCorrect = isAttempted && userSelected === question.answer;

            return (
              <div
                key={index}
                className={`question-review md:p-5 pr-3 pl-1 py-5 border rounded-lg shadow-sm ${
                  isAttempted 
                    ? isCorrect 
                      ? "border-green-300 bg-green-50" 
                      : "border-red-300 bg-red-50"
                    : "border-yellow-300 bg-yellow-50"
                }`}
              >
                <div className="flex items-start md:gap-3 gap-1">
                  {isAttempted ? (
                    isCorrect ? (
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    )
                  ) : (
                    <AlertCircle className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                  )}
                  <div className="w-full">
                    <h3 className="md:text-lg font-semibold">
                      {question.question}
                      {!isAttempted && (
                        <span className="ml-2 text-yellow-600 font-normal text-sm inline-block px-2 py-1 bg-yellow-100 rounded">
                          {t("examReview.notAttempted")}
                        </span>
                      )}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {question.options.map((option, optIndex) => {
                        let optionClass = "bg-white border border-gray-200";
                        let statusIcon = null;

                        if (option === question.answer) {
                          optionClass = "bg-green-100 border border-green-300 text-green-800";
                          statusIcon = <CheckCircle className="text-green-500" size={16} />;
                        } else if (isAttempted && option === userSelected) {
                          optionClass = "bg-red-100 border border-red-300 text-red-800";
                          statusIcon = <XCircle className="text-red-500" size={16} />;
                        }

                        return (
                          <li
                            key={optIndex}
                            className={`md:p-3 py-2 px-2 text-sm md:text-base rounded-md flex justify-between items-center ${optionClass}`}
                          >
                            <span>{option}</span>
                            {statusIcon}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600 md:text-lg">
            {t("examReview.noQuizData")}
          </p>
          <p className="text-gray-500 mt-2">
            {t("examReview.startNewQuiz")}
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg transition shadow-md flex items-center gap-2"
        >
          {t("examReview.backToHome")}
        </button>
      </div>
    </div>
  );
};

export default ExamReview;