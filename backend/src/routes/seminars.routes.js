// routes/seminar.routes.js
import express from "express";
import {
  getAllConductedSeminars,
  postUpcomingSeminar,
  seeFeedbacks,
  editConductedSeminarReport,
  deleteConductedSeminar,
  seeRSVPedStudents,
  seeFeedbackSubmitters,
  getAllUpcomingSeminarsForStudents,
  getAllUpcomingSeminarsByTeacher,
  conductSeminar,
  studentRSVP,
  studentSubmitFeedback,
  getPendingFeedbackFormsForConductedSeminars,
  editUpcomingSeminar,
  cancelUpcomingSeminar
} from "../controllers/seminars.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { verifyStudentJWT } from "../middleware/student.auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Teacher Routes
router.get("/seminars/conducted", verifyTeacherJWT, getAllConductedSeminars); // done
router.post("/seminars/upcoming", verifyTeacherJWT, postUpcomingSeminar); // done
router.get("/seminars/:seminarId/feedbacks", verifyTeacherJWT, seeFeedbacks);
router.put("/seminars/:seminarId", verifyTeacherJWT, upload.single('report'), editConductedSeminarReport);
router.delete("/seminars/:seminarId", verifyTeacherJWT, deleteConductedSeminar);
<<<<<<< HEAD
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
=======
router.get("/seminars/:seminarId/rsvps", verifyTeacherJWT, seeRSVPedStudents);
router.get( "/seminars/:seminarId/feedback-submitters", verifyTeacherJWT, seeFeedbackSubmitters);
router.get("/teachers/seminars/upcoming", verifyTeacherJWT, getAllUpcomingSeminarsByTeacher);
router.post("/seminars/conducted/:seminarId", verifyTeacherJWT, upload.single('report'), conductSeminar);
router.patch("/seminars/:seminarId", verifyTeacherJWT, editUpcomingSeminar);
router.delete("/seminars/:seminarId", verifyTeacherJWT, cancelUpcomingSeminar);

// Student Routes
router.get("/seminars/upcoming", verifyStudentJWT, getAllUpcomingSeminarsForStudents);
router.post("/seminars/rsvp", verifyStudentJWT, studentRSVP);
router.post("/seminars/feedback", verifyStudentJWT, studentSubmitFeedback);
router.get("/seminars/allfeedbackforms", verifyStudentJWT, getPendingFeedbackFormsForConductedSeminars)
>>>>>>> 6b4ca625e67cc7c4ea4461dee01d504c2f7b1aaa

export default router;
