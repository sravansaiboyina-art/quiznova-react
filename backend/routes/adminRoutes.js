import { Router } from "express";
import {
  getStats,
  getUsers,
  updateUserRole,
  getQuestionsAdmin,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAttempts,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/questions", getQuestionsAdmin);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.get("/attempts", getAttempts);

export default router;
