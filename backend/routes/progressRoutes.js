import { Router } from "express";
import { getProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getProgress);

export default router;