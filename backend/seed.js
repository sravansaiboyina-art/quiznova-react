import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import Question from './models/Question.js';
import { connectDB } from './config/db.js';

const file = path.resolve('data/questions.json');
const questions = JSON.parse(fs.readFileSync(file, 'utf8'));
await connectDB();
await Question.deleteMany({});
await Question.insertMany(questions.map(q => ({ legacyId: q.id, category: q.category, difficulty: q.difficulty, question: q.question, options: q.options, answer: q.answer })));
console.log(`Seeded ${questions.length} questions.`);
await mongoose.disconnect();
