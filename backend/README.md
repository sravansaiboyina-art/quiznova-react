# QuizNova Backend API

Express + MongoDB + Mongoose + JWT backend for QuizNova.

## Setup

1. Install MongoDB locally or create a MongoDB Atlas database.
2. Open a terminal in `backend`.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and set `MONGO_URI` and a strong `JWT_SECRET`.
5. Run `npm run seed` to insert the 210 QuizNova questions.
6. Run `npm run dev`.

Server: `http://localhost:5000`

## API endpoints

- GET `/api/health`
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` — Bearer token required
- GET `/api/questions/meta`
- GET `/api/questions?category=HTML&difficulty=Easy&limit=5`
- POST `/api/quizzes/submit` — accepts an optional Bearer token; authenticated attempts are linked to the user
- GET `/api/quizzes/my-results` — Bearer token required

## JWT

Register/login returns a JWT in `token`. Send it on protected requests as:

`Authorization: Bearer <token>`

Never commit `.env` or a real JWT secret to GitHub.

## Database collections

- `users`
- `questions`
- `quizattempts`

The source dataset is `data/questions.json` and contains the 210 questions from the React project.
