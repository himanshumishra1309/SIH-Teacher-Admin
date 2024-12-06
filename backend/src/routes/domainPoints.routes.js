import express from "express";
import {
  addPoints,
  updatePoints,
  deletePoints,
  getAllPoints,
  getJournalPoints,
  editJournalPoints,
  getBookPoints,
  editBookPoints,
  getChapterPoints,
  editChapterPoints,
  getConferencePoints,
  editConferencePoints,
  getPatentPoints,
  editPatentPoints,
  getProjectPoints,
  editProjectPoints,
  getStudentGuidancePoints,
  editStudentGuidancePoints,
  getEventOrganizerPoints,
  editEventOrganizerPoints,
  getEventSpeakerPoints,
  editEventSpeakerPoints,
  getEventJudgePoints,
  editEventJudgePoints,
  getEventCoordinatorPoints,
  editEventCoordinatorPoints,
  getEventVolunteerPoints,
  editEventVolunteerPoints,
  getEventEvaluatorPoints,
  editEventEvaluatorPoints,
  getEventPanelistPoints,
  editEventPanelistPoints,
  getEventMentorPoints,
  editEventMentorPoints,
  getEventSessionChairPoints,
  editEventSessionChairPoints,
  getEventReviewerPoints,
  editEventReviewerPoints,
  getExpertLecturePoints,
  editExpertLecturePoints,
  getSeminarAttendedPoints,
  editSeminarAttendedPoints,
  getTheoryCoursePoints,
  editTheoryCoursePoints,
  getPracticalCoursePoints,
  editPracticalCoursePoints,
  getSttpPoints,
  editSttpPoints,
  getSeminarPoints,
  editSeminarPoints,
  getAllEventPoints,
  editAllEventPoints,
} from "../controllers/domainPoints.controllers.js";
import { verifyAdminJWT } from "../middleware/admin.auth.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";

const adminRouter = express.Router();
const teacherRouter = express.Router();

// Admin routes
adminRouter.post("/points", addPoints);
adminRouter.put("/points/:domainId", updatePoints);
adminRouter.delete("/points/:domainId", deletePoints);
adminRouter.get("/points", getAllPoints);

adminRouter.put("/journal", editJournalPoints);
adminRouter.put("/book", editBookPoints);
adminRouter.put("/chapter", editChapterPoints);
adminRouter.put("/conference", editConferencePoints);
adminRouter.put("/patent", editPatentPoints);
adminRouter.put("/project", editProjectPoints);
adminRouter.put("/student-guidance", editStudentGuidancePoints);
adminRouter.put("/event-organizer", editEventOrganizerPoints);
adminRouter.put("/event-speaker", editEventSpeakerPoints);
adminRouter.put("/event-judge", editEventJudgePoints);
adminRouter.put("/event-coordinator", editEventCoordinatorPoints);
adminRouter.put("/event-volunteer", editEventVolunteerPoints);
adminRouter.put("/event-evaluator", editEventEvaluatorPoints);
adminRouter.put("/event-panelist", editEventPanelistPoints);
adminRouter.put("/event-mentor", editEventMentorPoints);
adminRouter.put("/event-session-chair", editEventSessionChairPoints);
adminRouter.put("/event-reviewer", editEventReviewerPoints);
adminRouter.put("/expert-lecture", editExpertLecturePoints);
adminRouter.put("/seminar-attended", editSeminarAttendedPoints);
adminRouter.put("/theory-course", editTheoryCoursePoints);
adminRouter.put("/practical-course", editPracticalCoursePoints);
adminRouter.put("/sttp", editSttpPoints);
adminRouter.put("/seminar", editSeminarPoints);
adminRouter.put("/all-event-points", editAllEventPoints);

// Teacher routes
teacherRouter.get("/points", getAllPoints);
teacherRouter.get("/journal", getJournalPoints);
teacherRouter.get("/book", getBookPoints);
teacherRouter.get("/chapter", getChapterPoints);
teacherRouter.get("/conference", getConferencePoints);
teacherRouter.get("/patent", getPatentPoints);
teacherRouter.get("/project", getProjectPoints);
teacherRouter.get("/student-guidance", getStudentGuidancePoints);
teacherRouter.get("/event-organizer", getEventOrganizerPoints);
teacherRouter.get("/event-speaker", getEventSpeakerPoints);
teacherRouter.get("/event-judge", getEventJudgePoints);
teacherRouter.get("/event-coordinator", getEventCoordinatorPoints);
teacherRouter.get("/event-volunteer", getEventVolunteerPoints);
teacherRouter.get("/event-evaluator", getEventEvaluatorPoints);
teacherRouter.get("/event-panelist", getEventPanelistPoints);
teacherRouter.get("/event-mentor", getEventMentorPoints);
teacherRouter.get("/event-session-chair", getEventSessionChairPoints);
teacherRouter.get("/event-reviewer", getEventReviewerPoints);
teacherRouter.get("/expert-lecture", getExpertLecturePoints);
teacherRouter.get("/seminar-attended", getSeminarAttendedPoints);
teacherRouter.get("/theory-course", getTheoryCoursePoints);
teacherRouter.get("/practical-course", getPracticalCoursePoints);
teacherRouter.get("/sttp", getSttpPoints);
teacherRouter.get("/seminar", getSeminarPoints);
teacherRouter.get("/all-event-points", getAllEventPoints);

// Apply middleware to routers
const adminRoutes = express.Router();
adminRoutes.use("/admin", verifyAdminJWT, adminRouter);

const teacherRoutes = express.Router();
teacherRoutes.use("/teacher", verifyTeacherJWT, teacherRouter);

// Combine routes
const router = express.Router();
router.use(adminRoutes);
router.use(teacherRoutes);

export default router;
