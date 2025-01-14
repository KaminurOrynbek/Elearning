import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../../main";
import toast from "react-hot-toast";
import "./QuizResults.css";

const QuizResults = ({ user }) => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(`${server}/api/quiz/results/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setResults(data.results);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchResults();
  }, [id]);

  if (!results) return <div>Loading...</div>;

  return (
    <div className="quiz-results-container">
      <h2>Quiz Results</h2>
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
        <button onClick={() => navigate(`/course/study/${results[0].course}`)} className="common-btn">
          Back to Course
        </button>
      </div>
    </div>
  );
};

export default QuizResults;