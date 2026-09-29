import Question from '../models/Question.js';

export async function getQuestions(req, res) {
  const { category, difficulty, limit = 10 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const questions = await Question.aggregate([{ $match: filter }, { $sample: { size: safeLimit } }]);
  res.json({ count: questions.length, questions: questions.map(({ answer, ...q }) => q) });
}

export async function getQuestionMeta(req, res) {
  const categories = await Question.distinct('category');
  const difficulties = await Question.distinct('difficulty');
  res.json({ categories, difficulties });
}
