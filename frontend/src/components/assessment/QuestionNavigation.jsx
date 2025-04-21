import React from "react";

const QuestionNavigation = ({ 
  totalQuestions, 
  currentQuestion, 
  answeredQuestions, 
  onQuestionClick 
}) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-2 " >
      {Array.from({ length: totalQuestions }).map((_, index) => {
        // Determine the status of this question
        const isActive = currentQuestion === index;
        const isAnswered = answeredQuestions[index] !== undefined;
        
        return (
          <button
          key={index}
          onClick={() => onQuestionClick(index)}
          className={`cursor-pointer group relative w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-300 
            ${
              isActive
                ? "bg-indigo-700 text-white border border-indigo-500 shadow-lg" // Brighter active state for contrast
                : isAnswered
                ? "bg-gray-100 text-indigo-700 border border-indigo-500 hover:bg-gray-800" // Subtle contrast for answered state
                : "bg-gray-100 text-black border border-gray-600 hover:border-indigo-500 hover:bg-gray-500 hover:text-white"
            }`}
        >
          {index + 1}
          {isAnswered && !isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </button>
        
          
        );
      })}
    </div>
  );
};

export default QuestionNavigation;