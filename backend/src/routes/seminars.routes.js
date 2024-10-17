// routes/seminar.routes.js
import express from 'express';
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
  studentSubmitFeedback
} from '../controllers/seminar.controller.js';
import { verifyTeacherJWT } from '../middlewares/verifyTeacherJWT.js';
import { verifyStudentJWT } from '../middlewares/verifyStudentJWT.js';

const router = express.Router();

// Teacher Routes
router.get('/seminars/conducted', verifyTeacherJWT, getAllConductedSeminars);
router.post('/seminars/upcoming', verifyTeacherJWT, postUpcomingSeminar);
router.get('/seminars/:seminarId/feedbacks', verifyTeacherJWT, seeFeedbacks);
router.put('/seminars/:seminarId', verifyTeacherJWT, editConductedSeminar);
router.delete('/seminars/:seminarId', verifyTeacherJWT, deleteConductedSeminar);
router.get('/seminars/:seminarId/rsvps', verifyTeacherJWT, seeRSVPedStudents);
router.get('/seminars/:seminarId/feedback-submitters', verifyTeacherJWT, seeFeedbackSubmitters);
router.get('/teachers/seminars/upcoming', verifyTeacherJWT, getAllUpcomingSeminarsByTeacher);
router.post('/seminars/conducted', verifyTeacherJWT, conductSeminar);

// Student Routes
router.get('/seminars/upcoming', verifyStudentJWT, getAllUpcomingSeminarsForStudents);
router.post('/seminars/rsvp', verifyStudentJWT, studentRSVP);
router.post('/seminars/feedback', verifyStudentJWT, studentSubmitFeedback);

export default router;
