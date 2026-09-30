import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Keep this endpoint independent of MongoDB so deployment/routing can be
// verified even while database networking is being configured.
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'QuizNova API' })
);

let dbConnectionPromise;

async function ensureDatabaseConnection() {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }

  try {
    return await dbConnectionPromise;
  } catch (error) {
    // Do not permanently cache a failed connection attempt in a warm
    // serverless instance. A later request can retry after Atlas is fixed.
    dbConnectionPromise = undefined;
    throw error;
  }
}

app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(503).json({
      message: 'Database unavailable',
      detail: process.env.NODE_ENV === 'production'
        ? 'Check the Vercel MongoDB environment variable and Atlas network access.'
        : error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

app.use((req, res) =>
  res.status(404).json({ message: 'API route not found' })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () =>
    console.log(`QuizNova API running on http://localhost:${port}`)
  );
}
