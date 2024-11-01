// routes/seminar.routes.js
import express from "express";
import {
  getAllConductedSeminars,
  postUpcomingSeminar,
  seeFeedbacks,
  editConductedSeminar,
  deleteConductedSeminar,
  seeRSVPedStudents,
  seeFeedbackSubmitters,
  getAllUpcomingSeminarsForStudents,
  getAllUpcomingSeminarsByTeacher,
  conductSeminar,
  studentRSVP,
  studentSubmitFeedback,
} from "../controllers/seminars.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { verifyStudentJWT } from "../middleware/student.auth.middleware.js";

const router = express.Router();

// Teacher Routes
router.get("/seminars/conducted", verifyTeacherJWT, getAllConductedSeminars); // done
router.post("/seminars/upcoming", verifyTeacherJWT, postUpcomingSeminar); // done
router.get("/seminars/:seminarId/feedbacks", verifyTeacherJWT, seeFeedbacks);
router.put("/seminars/:seminarId", verifyTeacherJWT, editConductedSeminar);
router.delete("/seminars/:seminarId", verifyTeacherJWT, deleteConductedSeminar);
router.get("/seminars/:seminarId/rsvps", verifyTeacherJWT, seeRSVPedStudents); // done
router.get(
  "/seminars/:seminarId/feedback-submitters",
  verifyTeacherJWT,
  seeFeedbackSubmitters
); // done
router.get(
  "/teachers/seminars/upcoming",
  verifyTeacherJWT,
  getAllUpcomingSeminarsByTeacher
); //done
router.post("/seminars/conducted", verifyTeacherJWT, conductSeminar); // done

// Student Routes
router.get(
  "/seminars/upcoming",
  verifyStudentJWT,
  getAllUpcomingSeminarsForStudents
); // done
router.post("/seminars/rsvp", verifyStudentJWT, studentRSVP); // done
router.post("/seminars/feedback", verifyStudentJWT, studentSubmitFeedback); //done

export default router;
