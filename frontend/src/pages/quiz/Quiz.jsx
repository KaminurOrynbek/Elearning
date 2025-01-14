import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../../main";
import "./Quiz.css";
import toast from "react-hot-toast";

const Quiz = ({ user }) => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`${server}/api/quiz/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setQuiz(data.quiz);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/api/quiz/submit`,
        {
          userId: user._id,
          quizId: quiz._id,
          answers,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      setResults(data.results);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="quiz-container">
      <h2>{quiz.title}</h2>
      {results ? (
        <div className="quiz-results">
          <h3>Your Results</h3>
          <p>Score: {results.filter(result => result.isCorrect).length} / {results.length}</p>
          <ul>
            {results.map((result, index) => (
              <li key={index} className={result.isCorrect ? "correct" : "incorrect"}>
                <p>Question: {result.question}</p>
                <p>Your Answer: {result.userAnswer}</p>
                <p>Correct Answer: {result.correctAnswer}</p>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate(`/course/study/${quiz.course}`)} className="common-btn">
            Back to Course
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((question, index) => (
            <div key={index} className="quiz-question">
              <p>{question.question}</p>
              <ul className="quiz-options">
                {question.options.map((option, i) => (
                  <li key={i}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={() => handleAnswerChange(index, option)}
                        required
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button type="submit" className="quiz-submit">
            Submit Quiz
          </button>
        </form>
      )}
    </div>
  );
};

export default Quiz;