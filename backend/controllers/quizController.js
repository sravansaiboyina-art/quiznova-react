import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';

export async function submitQuiz(req, res) {
  const { category, difficulty, answers = [], studentName = 'Guest' } = req.body;
  if (!category || !difficulty || !Array.isArray(answers) || answers.length === 0) return res.status(400).json({ message: 'Category, difficulty and answers are required' });
  const ids = answers.map(a => Number(a.questionId)).filter(Number.isFinite);
  const questions = await Question.find({ legacyId: { $in: ids } }).lean();
  const map = new Map(questions.map(q => [q.legacyId, q]));
  let score = 0;
  const evaluated = answers.map(a => {
    const q = map.get(Number(a.questionId));
    const correctAnswer = q?.answer ?? null;
    const isCorrect = Boolean(q && a.selectedAnswer === correctAnswer);
    if (isCorrect) score++;
    return { questionId: Number(a.questionId), selectedAnswer: a.selectedAnswer ?? null, correctAnswer, isCorrect };
  });
  const total = evaluated.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const attempt = await QuizAttempt.create({ user: req.user?._id || null, studentName, category, difficulty, total, score, percentage, answers: evaluated });
  res.status(201).json({ message: 'Quiz submitted', result: { id: attempt._id, category, difficulty, total, score, percentage, wrong: total - score } });
}

export async function myResults(req, res) {
  const results = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).select('-answers');
  res.json({ results });
}
