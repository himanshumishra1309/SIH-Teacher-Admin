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
  fillEligibleFeedbackForm,
  getStudentsByBranch,
  addSeminarAttended,
  editSeminarAttended,
  getAllSeminarsAttended,
  deleteSeminarAttended,
} from "../controllers/seminars.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { verifyStudentJWT } from "../middleware/student.auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post(
  "/seminars/conducted",
  verifyTeacherJWT,
  upload.single("report"),
  uploadConductedSeminar
);

router.get("/conducted", verifyTeacherJWT, getConductedSeminars);

router.put("/:seminarId/edit", verifyTeacherJWT, editUploadedSeminar);

router.delete("/:seminarId", verifyTeacherJWT, deleteUploadedSeminar);

router.post(
  "/:seminarId/release-feedback",
  verifyTeacherJWT,
  releaseFeedbackForm
);

router.get("/:seminarId/feedbacks", verifyTeacherJWT, viewFeedbacks);

router.get(
  "/:seminarId/feedback-submitters",
  verifyTeacherJWT,
  getFeedbackSubmitters
);

router.post(
  "/:seminarId/attendance/:teacherId",
  verifyTeacherJWT,
  markAttendance
);

router.get(
  "/feedbacks-available",
  verifyStudentJWT,
  viewSeminarFeedbackFormsAvailable
);

router.post(
  "/:seminarId/fill-feedback",
  verifyStudentJWT,
  fillEligibleFeedbackForm
);

router.get("/students/:branchName", getStudentsByBranch);

router.post(
  "/seminars/attended",
  verifyTeacherJWT,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "report", maxCount: 1 },
  ]),
  addSeminarAttended
);

router.put(
  "/seminars/attended/:id",
  verifyTeacherJWT,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "report", maxCount: 1 },
  ]),
  editSeminarAttended
);

router.get("/seminars/attended", verifyTeacherJWT, getAllSeminarsAttended);

router.delete(
  "/seminars/attended/:id",
  verifyTeacherJWT,
  deleteSeminarAttended
);

export default router;
