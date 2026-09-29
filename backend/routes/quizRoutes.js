import { Router } from "express";

import {
  submitQuiz,
  myResults,
} from "../controllers/quizController.js";

import { protect } from "../middleware/auth.js";

const router = Router();

/*
 * Quiz submission requires a logged-in user.
 * The JWT identifies which student submitted the quiz.
 */
router.post("/submit", protect, submitQuiz);

/*
 * Only the logged-in user's results are returned.
 */
router.get("/my-results", protect, myResults);

export default router;