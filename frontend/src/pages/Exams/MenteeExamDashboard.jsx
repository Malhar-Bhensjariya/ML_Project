import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Clock, CheckCircle, X, FileText, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExamResults from './ExamResults';

const MenteeExamDashboard = () => {
  const { user } = useUser();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [startExam, setStartExam] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedExams, setCompletedExams] = useState({});
  const NODE_API = import.meta.env.VITE_NODE_API;
  useEffect(() => {
    if (user?._id) {
      fetchExams();
    }
  }, [user]);

  const fetchExams = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${NODE_API}/exam/mentee/${user?._id}`);
      const data = await response.json();
      setExams(data);
      
      // Check completion status for each exam
      const completionStatus = {};
      for (const exam of data) {
        try {
          const statusResponse = await axios.get(
            `${NODE_API}/exam/status/${exam._id}/${user._id}`
          );
          completionStatus[exam._id] = statusResponse.data.isCompleted;
        } catch (statusErr) {
          console.error(`Error checking status for exam ${exam._id}:`, statusErr);
          completionStatus[exam._id] = false;
        }
      }
      setCompletedExams(completionStatus);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load your exams. Please try again later.');
      toast.error('Failed to load your exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStartExam = (exam) => {
    if (completedExams[exam._id]) {
      toast.info('You have already completed this exam.');
      return;
    }
    
    setSelectedExam(exam);
    setStartExam(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setExamSubmitted(false);
    setExamResult(null);
  };

  const handleSelectAnswer = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedExam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!user?._id || !selectedExam?._id) return;
    if (submitting) return; // Prevent multiple submissions
    
    setSubmitting(true);
    
    // Calculate result
    let correctAnswers = 0;
    selectedExam.questions.forEach(question => {
      if (selectedAnswers[question._id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
  
    const result = {
      score: correctAnswers,
      totalMarks: selectedExam.questions.length,
      percentage: (correctAnswers / selectedExam.questions.length) * 100
    };
  
    setExamResult(result);
    setExamSubmitted(true);
  
    // Convert selected answers object to array
    const answersArray = Object.values(selectedAnswers);
  
    // Submit exam result to API
    try {
      const response = await axios.post(`${NODE_API}/exam/submit/${selectedExam._id}`, {
        userId: user._id,
        answers: answersArray
      });
    
      if (response.status === 200) {
        toast.success('Exam submitted successfully!');
        
        // Update completion status
        setCompletedExams({
          ...completedExams,
          [selectedExam._id]: true
        });
        
        // Update the exam in the local state to mark it as attempted
        const updatedExams = exams.map(exam => {
          if (exam._id === selectedExam._id) {
            // Create a new score object
            const newScore = {
              mentee: user._id,
              score: correctAnswers,
              totalMarks: selectedExam.questions.length,
              percentage: (correctAnswers / selectedExam.questions.length) * 100,
              submittedAt: new Date().toISOString()
            };
            
            // Add the score to the exam
            return {
              ...exam,
              scores: [...(exam.scores || []), newScore]
            };
          }
          return exam;
        });
        
        setExams(updatedExams);
      } else {
        toast.error('Failed to submit exam results');
      }
    } catch (err) {
      console.error('Error submitting exam results:', err);
      toast.error('Error submitting exam results. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedExam(null);
    setStartExam(false);
    setExamSubmitted(false);
    setExamResult(null);
    // Refresh exams list to show updated scores
    fetchExams();
  };

  // Calculate progress for selected exam
  const calculateProgress = () => {
    if (!selectedExam) return 0;
    const answered = Object.keys(selectedAnswers).length;
    return Math.round((answered / selectedExam.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <ToastContainer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <AlertTriangle className="text-red-500 mr-4" size={24} />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Exam Taking View
  if (startExam && selectedExam) {
    const currentQuestionData = selectedExam.questions[currentQuestion];
    const progress = calculateProgress();
    
    // Result View
    if (examSubmitted && examResult) {
      return (
        <>
          <ExamResults 
            examResult={examResult} 
            selectedExam={selectedExam} 
            selectedAnswers={selectedAnswers} 
            handleBackToDashboard={handleBackToDashboard} 
          />
          <ToastContainer />
        </>
      );
    }
    
    // Exam Questions View
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header and Navigation */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <button 
                  onClick={handleBackToDashboard}
                  className="text-gray-500 hover:text-indigo-600 transition flex items-center text-sm mb-2"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                  {selectedExam.title}
                </h1>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Clock size={16} className="mr-2 text-indigo-500" />
                  <span>Question {currentQuestion + 1} of {selectedExam.questions.length}</span>
                </div>
                <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Question Text */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8">
              <h2 className="text-xl font-medium text-white">
                {currentQuestionData.questionText}
              </h2>
            </div>
            
            {/* Answer Options */}
            <div className="p-8">
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleSelectAnswer(currentQuestionData._id, option)}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.01] ${
                      selectedAnswers[currentQuestionData._id] === option
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 transition-all ${
                        selectedAnswers[currentQuestionData._id] === option
                          ? 'bg-indigo-500 text-white' 
                          : 'border-2 border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestionData._id] === option && 
                          <CheckCircle size={16} />
                        }
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="bg-gray-50 p-6 flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-xl flex items-center transition ${
                  currentQuestion === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-indigo-600 border border-indigo-200 shadow-sm hover:shadow-md'
                }`}
              >
                <ArrowLeft size={18} className="mr-2" />
                Previous
              </button>
              
              {currentQuestion < selectedExam.questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transition flex items-center"
                >
                  Next
                  <ArrowRight size={18} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  disabled={Object.keys(selectedAnswers).length < selectedExam.questions.length || submitting}
                  className={`px-6 py-3 rounded-xl transition flex items-center ${
                    Object.keys(selectedAnswers).length < selectedExam.questions.length || submitting
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                  <CheckCircle size={18} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 mb-2">
                My Exams
              </h1>
              <p className="text-gray-600">
                Complete your assessments to track your progress
              </p>
            </div>
            <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-50 rounded-full flex items-center">
              <Award className="text-indigo-500 mr-2" size={20} />
              <span className="text-indigo-700 font-medium">
                {exams.length} {exams.length === 1 ? 'exam' : 'exams'} assigned
              </span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <BookOpen className="text-indigo-500" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Available Exams</p>
                  <p className="text-xl font-bold text-gray-800">{exams.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-xl font-bold text-gray-800">
                    {Object.values(completedExams).filter(Boolean).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <Clock className="text-amber-500" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-xl font-bold text-gray-800">
                    {exams.length - Object.values(completedExams).filter(Boolean).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exams List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Assignments</h2>
          
          {exams.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-16 text-center">
              <div className="bg-indigo-50 p-4 rounded-full inline-flex justify-center mb-6">
                <FileText className="text-indigo-500" size={40} />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Exams Assigned</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any exams assigned to you yet. Check back later or contact your mentor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams?.map((exam) => {
                const isExamCompleted = completedExams[exam._id] || false;
                
                return (
                  <div 
                    key={exam._id} 
                    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${
                      isExamCompleted ? 'border-green-500' : 'border-indigo-500'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{exam.title}</h3>
                        {isExamCompleted ? (
                          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center">
                            <Clock size={12} className="mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-5 line-clamp-2 h-12">{exam.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-5">
                        <div className="flex items-center mr-4">
                          <BookOpen size={16} className="mr-1 text-indigo-400" />
                          <span>{exam.questions.length} {exam.questions.length === 1 ? 'question' : 'questions'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1 text-indigo-400" />
                          <span>{formatDate(exam.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-lg mb-5 ${
                        isExamCompleted 
                          ? 'bg-green-50 border border-green-100' 
                          : 'bg-indigo-50 border border-indigo-100'
                      }`}>
                        <p className={`text-sm font-medium ${
                          isExamCompleted ? 'text-green-700' : 'text-indigo-700'
                        }`}>
                          {isExamCompleted 
                            ? '✓ You have successfully completed this exam.' 
                            : '• Ready for you to take this exam.'}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleStartExam(exam)}
                        disabled={isExamCompleted}
                        className={`w-full py-3 rounded-lg transition-all ${
                          isExamCompleted
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:shadow-md'
                        }`}
                      >
                        {isExamCompleted ? 'Already Completed' : 'Start Exam'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MenteeExamDashboard;