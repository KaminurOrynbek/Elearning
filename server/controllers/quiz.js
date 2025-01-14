import TryCatch from "../middlewares/TryCatch.js";
import { Quiz } from "../models/quizModel.js";
import { Courses } from "../models/Courses.js";
import { User } from "../models/User.js";

export const createQuiz = TryCatch(async (req, res) => {
  const { title, questions, courseId } = req.body;
  const quiz = await Quiz.create({ title, questions, course: courseId });

  // Update the course with the quizId
  const course = await Courses.findById(courseId);
  course.quizId = quiz._id;
  await course.save();

  res.status(201).json({ message: "Quiz Created Successfully", quiz });
});

export const getQuiz = TryCatch(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json({ quiz });
});

export const submitQuiz = TryCatch(async (req, res) => {
  const { userId, quizId, answers } = req.body;
  const user = await User.findById(userId);
  const quiz = await Quiz.findById(quizId);

  let score = 0;
  const results = quiz.questions.map((question, index) => {
    const isCorrect = question.correctAnswer === answers[index];
    if (isCorrect) {
      score += 1;
    }
    return {
      question: question.question,
      correctAnswer: question.correctAnswer,
      userAnswer: answers[index],
      isCorrect,
    };
  });

  if (!user.quizResults) {
    user.quizResults = [];
  }

  user.quizResults.push({ quiz: quizId, score });
  await user.save();

  res.json({ message: "Quiz Submitted Successfully", score, results });
});

export const getQuizResults = TryCatch(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id).populate("quizResults.quiz");

  const quizResult = user.quizResults.find(result => result.quiz._id.toString() === id);

  if (!quizResult) {
    return res.status(404).json({ message: "Quiz results not found" });
  }

  const quiz = await Quiz.findById(id);

  const results = quiz.questions.map((question, index) => {
    const userAnswer = quizResult.answers[index];
    const isCorrect = question.correctAnswer === userAnswer;
    return {
      question: question.question,
      correctAnswer: question.correctAnswer,
      userAnswer,
      isCorrect,
      course: quiz.course, // Include the course ID in the results
    };
  });

  res.json({ results });
});