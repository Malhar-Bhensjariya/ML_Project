import React from 'react';
import { Award, CheckCircle, X } from 'lucide-react';

const ExamResults = ({ examResult, selectedExam, selectedAnswers, handleBackToDashboard }) => {
  if (!examResult || !selectedExam) return null;
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-16 h-16 mb-4">
          <Award size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Exam Results</h1>
        <p className="text-gray-600 mt-2">{selectedExam.title}</p>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Your Score</p>
            <p className="text-2xl font-bold text-blue-600">{examResult.score}/{examResult.totalMarks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Percentage</p>
            <p className="text-2xl font-bold text-blue-600">{examResult.percentage.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Status</p>
            <p className={`text-lg font-bold ${examResult.percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
              {examResult.percentage >= 60 ? 'Passed' : 'Failed'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Question Summary</h2>
        <div className="space-y-4">
          {selectedExam.questions.map((question, index) => {
            const isCorrect = selectedAnswers[question._id] === question.correctAnswer;
            return (
              <div key={question._id} className={`border rounded-lg p-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{index + 1}. {question.questionText}</p>
                    <p className="mt-2 text-sm">
                      <span className="text-gray-600">Your answer: </span>
                      <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {selectedAnswers[question._id] || 'Not answered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-sm">
                        <span className="text-gray-600">Correct answer: </span>
                        <span className="text-green-600 font-medium">{question.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {isCorrect ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <X className="text-red-500" size={20} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button
          onClick={handleBackToDashboard}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ExamResults;