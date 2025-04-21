import React from "react";

const ExamCardItem = ({ quiz, userSelectedOption, selectedOption }) => {
  return (
    <div className="md:mt-2">
      <h2 className="font-medium text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-8">{quiz?.question}</h2>
      <div className="grid grid-cols-1 gap-2 sm:gap-4">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            onClick={() => userSelectedOption(option)}
            className={`relative cursor-pointer text-xs overflow-hidden text-left p-3 sm:p-4 w-full rounded-lg sm:rounded-xl transition-all duration-300 ease-in-out group ${
              selectedOption === option
                ? "bg-indigo-100 border-2 border-indigo-500"
                : "bg-white border-2 border-gray-100 hover:border-indigo-200"
            }`}
          >
            <div className={`absolute inset-y-0 left-0 w-1 ${
              selectedOption === option ? "bg-indigo-500" : "bg-transparent group-hover:bg-indigo-200"
            }`}></div>
            
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 sm:mr-4 transition-all duration-300 ${
                selectedOption === option 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-500"
              }`}>
                <span className="text-sm sm:text-base">{String.fromCharCode(65 + index)}</span>
              </div>
              
              <span className={`text-xs sm:text-lg ${
                selectedOption === option ? "text-indigo-800 font-medium" : "text-gray-700"
              }`}>
                {option}
              </span>
              
              {selectedOption === option && (
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamCardItem;