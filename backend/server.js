import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from "./routes/progressRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'QuizNova API' }));
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use("/api/progress", progressRoutes);
app.use((req, res) => res.status(404).json({ message: 'API route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Internal server error' }); });

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`QuizNova API running on http://localhost:${port}`))).catch(err => { console.error('Database connection failed:', err.message); process.exit(1); });
