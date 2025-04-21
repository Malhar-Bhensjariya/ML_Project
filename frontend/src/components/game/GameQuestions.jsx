import React, { useState } from 'react';

const GameQuestions = ({ questions, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers, answer];
    setUserAnswers(newUserAnswers);
    setSelectedAnswer(answer);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        onComplete(newUserAnswers);
      }
    }, 1500);
  };

  return (
    <div className="relative max-w-2xl mx-auto bg-gray-800/90 md:p-8 p-4 rounded-xl shadow-xl mt-4">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 text-2xl hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full p-1"
      >
        ←
      </button>
      
      <div className="text-right mb-4 text-gray-300">
        Question {currentQuestion + 1}/{questions.length}
      </div>

      <div className="mb-8">
        <h2 className="md:text-2xl text-white font-semibold mb-6">{questions[currentQuestion].question}</h2>
        
        <div className="grid grid-cols-1 gap-3 text-white">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`p-4 text-sm md:text-base rounded-lg text-left transition-all focus:outline-none focus:ring-2 focus:ring-white/50 ${
                !selectedAnswer ? 'bg-gray-700 hover:bg-gray-600' : ''
              } ${
                selectedAnswer === option ? 
                  (option === questions[currentQuestion].correct_answer ? 
                    'bg-green-600' : 'bg-red-600') : ''
              } ${
                showFeedback && option === questions[currentQuestion].correct_answer ? 
                'bg-green-600' : ''
              }`}
              onClick={() => !selectedAnswer && handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`text-center text-xl font-bold md:py-4 rounded ${
          selectedAnswer === questions[currentQuestion].correct_answer ? 
            'text-green-400' : 'text-red-400'
        }`}>
          {selectedAnswer === questions[currentQuestion].correct_answer ? 
            'Correct! 🎉' : 'Wrong! 😢'}
        </div>
      )}
    </div>
  );
};

export default GameQuestions;