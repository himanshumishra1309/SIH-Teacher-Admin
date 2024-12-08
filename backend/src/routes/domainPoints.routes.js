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
adminRouter.put("/points/:id", updatePoints);
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

adminRouter.get("/points", getAllPoints); // done
adminRouter.get("/journal", getJournalPoints); // done
adminRouter.get("/book", getBookPoints); // done
adminRouter.get("/book", getBookPoints); // done
adminRouter.get("/chapter", getChapterPoints); // done 
adminRouter.get("/conference", getConferencePoints); // done
adminRouter.get("/patent", getPatentPoints);  // done
adminRouter.get("/project", getProjectPoints); // done
adminRouter.get("/student-guidance", getStudentGuidancePoints);
adminRouter.get("/event-organizer", getEventOrganizerPoints);
adminRouter.get("/event-speaker", getEventSpeakerPoints);
adminRouter.get("/event-judge", getEventJudgePoints);
adminRouter.get("/event-coordinator", getEventCoordinatorPoints);
adminRouter.get("/event-volunteer", getEventVolunteerPoints);
adminRouter.get("/event-evaluator", getEventEvaluatorPoints);
adminRouter.get("/event-panelist", getEventPanelistPoints);
adminRouter.get("/event-mentor", getEventMentorPoints);
adminRouter.get("/event-session-chair", getEventSessionChairPoints);
adminRouter.get("/event-reviewer", getEventReviewerPoints);
adminRouter.get("/expert-lecture", getExpertLecturePoints);
adminRouter.get("/seminar-attended", getSeminarAttendedPoints);
adminRouter.get("/theory-course", getTheoryCoursePoints);
adminRouter.get("/practical-course", getPracticalCoursePoints);
adminRouter.get("/sttp", getSttpPoints);
adminRouter.get("/seminar", getSeminarPoints);
adminRouter.get("/all-event-points", getAllEventPoints);

// Teacher routes
teacherRouter.get("/te-points", getAllPoints);
teacherRouter.get("/te-journal", getJournalPoints);
teacherRouter.get("/te-book", getBookPoints);
teacherRouter.get("/te-chapter", getChapterPoints);
teacherRouter.get("/te-conference", getConferencePoints);
teacherRouter.get("/te-patent", getPatentPoints);
teacherRouter.get("/te-project", getProjectPoints);
teacherRouter.get("/te-student-guidance", getStudentGuidancePoints);
teacherRouter.get("/te-event-organizer", getEventOrganizerPoints);
teacherRouter.get("/te-event-speaker", getEventSpeakerPoints);
teacherRouter.get("/te-event-judge", getEventJudgePoints);
teacherRouter.get("/te-event-coordinator", getEventCoordinatorPoints);
teacherRouter.get("/te-event-volunteer", getEventVolunteerPoints);
teacherRouter.get("/event-evaluator", getEventEvaluatorPoints);
teacherRouter.get("/te-event-panelist", getEventPanelistPoints);
teacherRouter.get("/te-event-mentor", getEventMentorPoints);
teacherRouter.get("/event-session-chair", getEventSessionChairPoints);
teacherRouter.get("/te-event-reviewer", getEventReviewerPoints);
teacherRouter.get("/te-expert-lecture", getExpertLecturePoints);
teacherRouter.get("/te-seminar-attended", getSeminarAttendedPoints);
teacherRouter.get("/te-theory-course", getTheoryCoursePoints);
teacherRouter.get("/te-practical-course", getPracticalCoursePoints);
teacherRouter.get("/te-sttp", getSttpPoints);
teacherRouter.get("/te-seminar", getSeminarPoints);
teacherRouter.get("/te-all-event-points", getAllEventPoints);

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
