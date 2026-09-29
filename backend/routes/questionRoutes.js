import { Router } from 'express';
import { getQuestions, getQuestionMeta } from '../controllers/questionController.js';
const router = Router();
router.get('/meta', getQuestionMeta);
router.get('/', getQuestions);
export default router;
