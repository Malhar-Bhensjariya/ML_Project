import React, { useState, useEffect } from "react";
import QuizCardItem from "./QuizCardItem";
import StepProgress from "../../components/StepProgress";
import { QuizQuestions } from "./QuizQuestions";

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [isCorrectAns, setIsCorrectAns] = useState(null);
  const [correctAns, setCorrectAns] = useState("");

  useEffect(() => {
    setQuiz(QuizQuestions);
  }, []);

  const checkAnswer = (userAnswer, currentQuestion) => {
    if (userAnswer === currentQuestion?.correctAnswer) {
      setIsCorrectAns(true);
      setCorrectAns(currentQuestion?.correctAnswer);
      return;
    }
    setIsCorrectAns(false);
    setCorrectAns(currentQuestion?.correctAnswer);
  };

  useEffect(() => {
    setCorrectAns("");
    setIsCorrectAns(null);
  }, [stepCount]);

  return (
    quiz.length > 0 && (
      <div>
        <h2 className="font-bold text-2xl">Quiz</h2>

        <StepProgress stepCount={stepCount} setStepCount={setStepCount} data={quiz} />

        {/* Quiz Card */}
        {quiz.length > 0 && (
          <QuizCardItem
            quiz={quiz[stepCount]}
            userSelectedOption={(v) => checkAnswer(v, quiz[stepCount])}
          />
        )}

        {/* Answer Feedback */}
        {isCorrectAns === false && (
          <div className="border p-3 border-red-700 bg-red-200 rounded-lg mt-4">
            <h2 className="font-bold text-lg text-red-600">Incorrect</h2>
            <p className="text-red-600">Correct Answer is: {correctAns}</p>
          </div>
        )}
        {isCorrectAns === true && (
          <div className="border p-3 border-green-700 bg-green-200 rounded-lg mt-4">
            <h2 className="font-bold text-lg text-green-600">Correct</h2>
            <p className="text-green-600">Your given answer is correct</p>
          </div>
        )}
      </div>
    )
  );
};

export default Quiz;
