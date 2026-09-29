import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  studentName: { type: String, default: 'Guest' },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  total: { type: Number, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  answers: [{ questionId: Number, selectedAnswer: String, correctAnswer: String, isCorrect: Boolean }]
}, { timestamps: true });

export default mongoose.model('QuizAttempt', quizAttemptSchema);
