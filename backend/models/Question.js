import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  legacyId: { type: Number, unique: true, index: true },
  category: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true, index: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
