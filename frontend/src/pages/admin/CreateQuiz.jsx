import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../main";
import toast from "react-hot-toast";
import "./CreateQuiz.css";

const CreateQuiz = ({ user }) => {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/api/quiz/new`,
        { title, questions, courseId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      navigate(`/course/${courseId}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (user.role !== "admin") {
    return <div>Access Denied. Only admins can create quizzes.</div>;
  }

  return (
    <div className="create-quiz-container">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <label>Question {qIndex + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
              required
            />
            <div className="options">
              {q.options.map((option, oIndex) => (
                <div key={oIndex}>
                  <label>Option {oIndex + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
            <label>Correct Answer:</label>
            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;