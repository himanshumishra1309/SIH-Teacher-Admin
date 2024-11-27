import express from "express";
import {
  getAllFeedbackCards,
  getDetailedFeedback,
  getSubmitters,
} from "../controllers/feedback.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";

const router = express.Router();

// Get feedback cards for a specific subject taught by the teacher
router.post(
  "/cards",
  verifyTeacherJWT, // Middleware to ensure only authenticated teachers access this
  getAllFeedbackCards
);

// Get detailed feedback for a specific feedback ID
router.get(
  "/detailed/:feedbackId",
  verifyTeacherJWT, // Middleware to ensure only authenticated teachers access this
  getDetailedFeedback
);

// Get submitters who have submitted feedback for a specific subject
router.get(
  "/submitters",
  verifyTeacherJWT, // Middleware to ensure only authenticated teachers access this
  getSubmitters
);

export default router;
