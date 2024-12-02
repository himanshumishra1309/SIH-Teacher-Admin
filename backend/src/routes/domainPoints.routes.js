import express from 'express';
import {
  addPoints, updatePoints, deletePoints, getAllPoints,
  getJournalPoints, editJournalPoints,
  getBookPoints, editBookPoints, getChapterPoints, editChapterPoints,
  getConferencePoints, editConferencePoints, getPatentPoints, editPatentPoints,
  getProjectPoints, editProjectPoints, getStudentGuidancePoints, editStudentGuidancePoints,
  getEventOrganizerPoints, editEventOrganizerPoints, getEventSpeakerPoints, editEventSpeakerPoints,
  getEventJudgePoints, editEventJudgePoints, getEventCoordinatorPoints, editEventCoordinatorPoints,
  getEventVolunteerPoints, editEventVolunteerPoints, getEventEvaluatorPoints, editEventEvaluatorPoints,
  getEventPanelistPoints, editEventPanelistPoints, getEventMentorPoints, editEventMentorPoints,
  getEventSessionChairPoints, editEventSessionChairPoints, getEventReviewerPoints, editEventReviewerPoints,
  getExpertLecturePoints, editExpertLecturePoints, getSeminarAttendedPoints, editSeminarAttendedPoints,
  getTheoryCoursePoints, editTheoryCoursePoints, getPracticalCoursePoints, editPracticalCoursePoints,
  getSttpPoints, editSttpPoints, getSeminarPoints, editSeminarPoints,
  getAllEventPoints, editAllEventPoints
} from '../controllers/domainPoints.controllers.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';
import {verifyTeacherJWT} from '../middleware/teacher.auth.middleware.js';

const router = express.Router();

// Middleware to allow both admin and teacher access
const allowBoth = [verifyAdminJWT, verifyTeacherJWT];

// Routes for domain points
router.post('/points', verifyAdminJWT, addPoints);
router.put('/points/:domain', verifyAdminJWT, updatePoints);
router.delete('/points/:domain', verifyAdminJWT, deletePoints);
router.get('/points', allowBoth, getAllPoints);

// Journal routes
router.get('/journal', allowBoth, getJournalPoints);
router.put('/journal', verifyAdminJWT, editJournalPoints);

// Book routes
router.get('/book', allowBoth, getBookPoints);
router.put('/book', verifyAdminJWT, editBookPoints);

// Chapter routes
router.get('/chapter', allowBoth, getChapterPoints);
router.put('/chapter', verifyAdminJWT, editChapterPoints);

// Conference routes
router.get('/conference', allowBoth, getConferencePoints);
router.put('/conference', verifyAdminJWT, editConferencePoints);

// Patent routes
router.get('/patent', allowBoth, getPatentPoints);
router.put('/patent', verifyAdminJWT, editPatentPoints);

// Project routes
router.get('/project', allowBoth, getProjectPoints);
router.put('/project', verifyAdminJWT, editProjectPoints);

// Student guidance routes
router.get('/student-guidance', allowBoth, getStudentGuidancePoints);
router.put('/student-guidance', verifyAdminJWT, editStudentGuidancePoints);

// Event organizer routes
router.get('/event-organizer', allowBoth, getEventOrganizerPoints);
router.put('/event-organizer', verifyAdminJWT, editEventOrganizerPoints);

// Event speaker routes
router.get('/event-speaker', allowBoth, getEventSpeakerPoints);
router.put('/event-speaker', verifyAdminJWT, editEventSpeakerPoints);

// Event judge routes
router.get('/event-judge', allowBoth, getEventJudgePoints);
router.put('/event-judge', verifyAdminJWT, editEventJudgePoints);

// Event coordinator routes
router.get('/event-coordinator', allowBoth, getEventCoordinatorPoints);
router.put('/event-coordinator', verifyAdminJWT, editEventCoordinatorPoints);

// Event volunteer routes
router.get('/event-volunteer', allowBoth, getEventVolunteerPoints);
router.put('/event-volunteer', verifyAdminJWT, editEventVolunteerPoints);

// Event evaluator routes
router.get('/event-evaluator', allowBoth, getEventEvaluatorPoints);
router.put('/event-evaluator', verifyAdminJWT, editEventEvaluatorPoints);

// Event panelist routes
router.get('/event-panelist', allowBoth, getEventPanelistPoints);
router.put('/event-panelist', verifyAdminJWT, editEventPanelistPoints);

// Event mentor routes
router.get('/event-mentor', allowBoth, getEventMentorPoints);
router.put('/event-mentor', verifyAdminJWT, editEventMentorPoints);

// Event session chair routes
router.get('/event-session-chair', allowBoth, getEventSessionChairPoints);
router.put('/event-session-chair', verifyAdminJWT, editEventSessionChairPoints);

// Event reviewer routes
router.get('/event-reviewer', allowBoth, getEventReviewerPoints);
router.put('/event-reviewer', verifyAdminJWT, editEventReviewerPoints);

// Expert lecture routes
router.get('/expert-lecture', allowBoth, getExpertLecturePoints);
router.put('/expert-lecture', verifyAdminJWT, editExpertLecturePoints);

// Seminar attended routes
router.get('/seminar-attended', allowBoth, getSeminarAttendedPoints);
router.put('/seminar-attended', verifyAdminJWT, editSeminarAttendedPoints);

// Theory course routes
router.get('/theory-course', allowBoth, getTheoryCoursePoints);
router.put('/theory-course', verifyAdminJWT, editTheoryCoursePoints);

// Practical course routes
router.get('/practical-course', allowBoth, getPracticalCoursePoints);
router.put('/practical-course', verifyAdminJWT, editPracticalCoursePoints);

// STTP routes
router.get('/sttp', allowBoth, getSttpPoints);
router.put('/sttp', verifyAdminJWT, editSttpPoints);

// Seminar routes
router.get('/seminar', allowBoth, getSeminarPoints);
router.put('/seminar', verifyAdminJWT, editSeminarPoints);

// Routes for all event-related points
router.get('/all-event-points', allowBoth, getAllEventPoints);
router.put('/all-event-points', verifyAdminJWT, editAllEventPoints);

export default router;