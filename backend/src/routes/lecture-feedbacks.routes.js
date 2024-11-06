import express from "express";
import {
  releaseSingleFeedbackForm,
  releaseAllFeedbackForm,
  getReleasedFeedbackForms,
  fillFeedbackForm,
  getFeedbackForSubject,
  getStudentDetails,
} from "../controllers/lecture-feedbacks.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { verifyStudentJWT } from "../middleware/student.auth.middleware.js"; // Assuming you have JWT middleware for students

const router = express.Router();

// Route to release a single feedback form for a specific subject (for teachers)
router.post(
  "/feedback/subject/:subjectId",
  verifyTeacherJWT,
  releaseSingleFeedbackForm
);

// Route to release feedback forms for all subjects taught by the teacher (for teachers)
router.post("/feedback/subjects", verifyTeacherJWT, releaseAllFeedbackForm);

// Route to get all active feedback forms for the logged-in student (for students)
router.get("/feedback/forms", verifyStudentJWT, getReleasedFeedbackForms);

// Route to submit feedback for a specific feedback form (for students)
router.post(
  "/feedback/form/:feedbackFormId",
  verifyStudentJWT,
  fillFeedbackForm
);

// Route to get feedback for a specific subject taught by the teacher (for teachers)
router.get(
  "/feedback/subject/:subject_name/:subject_code/:subject_credit/:branch/:year",
  verifyTeacherJWT,
  getFeedbackForSubject
);

// Route to get student details who have submitted feedback for a specific subject (for teachers)
router.get(
  "/feedback/students/:subject_name/:subject_code/:subject_credit/:branch/:year",
  verifyTeacherJWT,
  getStudentDetails
);

export default router;
