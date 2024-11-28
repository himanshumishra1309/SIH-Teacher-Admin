// // routes/seminar.routes.js
import express from "express";
import {
  uploadConductedSeminar,
  getConductedSeminars,
  editUploadedSeminar,
  deleteUploadedSeminar,
  releaseFeedbackForm,
  viewFeedbacks,
  getFeedbackSubmitters,
  markAttendance,
  viewSeminarFeedbackFormsAvailable,
} from "../controllers/seminars.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import {verifyStudentJWT} from "../middleware/student.auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Teacher Routes
router.post(
  "/seminars/conducted",
  verifyTeacherJWT,
  upload.single("report"),
  uploadConductedSeminar
); // Upload a conducted seminar

router.get(
  "/seminars/conducted",
  verifyTeacherJWT,
  getConductedSeminars
); // Get all conducted seminars

router.put(
  "/seminars/:seminarId",
  verifyTeacherJWT,
  editUploadedSeminar
); // Edit an uploaded seminar

router.delete(
  "/seminars/:seminarId",
  verifyTeacherJWT,
  deleteUploadedSeminar
); // Delete an uploaded seminar

router.post(
  "/seminars/:seminarId/release-feedback",
  verifyTeacherJWT,
  releaseFeedbackForm
); // Release feedback forms

router.get(
  "/seminars/:seminarId/feedbacks",
  verifyTeacherJWT,
  viewFeedbacks
); // View all feedbacks (anonymous)

router.get(
  "/seminars/:seminarId/feedback-submitters",
  verifyTeacherJWT,
  getFeedbackSubmitters
); // Get feedback submitters list

router.post(
  "/seminars/:seminarId/attendance",
  verifyTeacherJWT,
  markAttendance
); // Mark attendance for a seminar

router.get(
  "/seminars/feedbacks/available",
  verifyStudentJWT,
  viewSeminarFeedbackFormsAvailable
); // View feedback forms available for a student

export default router;
