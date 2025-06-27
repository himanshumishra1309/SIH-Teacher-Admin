import express from "express";
import {
  registerAdmin,
  registerTeacher,
  getCurrentTeacher,
  updateTeacherAccountDetails,
  updateTeacherAvatar,
  allotSubjectsToTeachers,
  viewAllAllocatedSubjectsOfTheTeacher,
  editAllocatedSubjectOfTheTeacher,
  deleteAllocatedSubjectOfTheTeacher,
  registerStudent,
  getCurrentStudent,
  updateStudentAccountDetails,
  updateStudentAvatar,
  getAllTheSubjects,
  allottSubjectsToStudents,
  viewAllSubjectsAllottedToTheStudent,
  editAllottedSubjectOfTheStudent,
  deleteAllottedSubjectOfTheStudent,
  releaseAllFeedbackForms,
  releaseFeedbackForSubjects,
  getAllFeedbackCards,
  getDetailedFeedback,
  getSubmitters,
  viewCompletedTasks,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  updateAdminAvatar,
  updateAccountDetails,
  assignTasks,
  viewAssignedTasks,
  getAllTheBranches,
  getAllTheStudentsOfParticularBranch,
  getAllTheTeachers,
  getTeacherPersonalInfo,
  getSubjectFeedbacks,
  getResearchPapersPublishedByTheTeacher,
  getEventsParticipatedByTheTeacher,
  getExpertLecturesDeliveredByTheTeacher,
  getSTTPConductedByTheTeacher,
  getMtechStudentsGuidedByTheTeacher,
  getPhdStudentsGuidedByTheTeacher,
  getProjectsHeldByTheTeacher,
  getSeminarsConductedByTheTeacher,
  getUpcomingSeminarByTheTeacher,
  getConductedSeminarFeedbacks,
  getLecturesConductedByTheTeacher,
  getAllBooks,
  getAllPatents,
  getAllConferences,
  getAllChapters,
  getAllTheJournals,
  getAllseminarAttended,
  getAllContributions,
} from "../controllers/admins.controllers.js";
import { verifyAdminJWT } from "../middleware/admin.auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerAdmin);
router.post(
  "/register-teacher",
  verifyAdminJWT,
  upload.single("avatar"),
  registerTeacher
);
router.get("/teacher/:teacherId", verifyAdminJWT, getCurrentTeacher);
router.patch(
  "/teacher/:teacherId/update",
  verifyAdminJWT,
  updateTeacherAccountDetails
);
router.put(
  "/teacher/:teacherId/avatar",
  verifyAdminJWT,
  upload.single("avatar"),
  updateTeacherAvatar
);
router.post(
  "/subjects/allocate/:teacherId",
  verifyAdminJWT,
  allotSubjectsToTeachers
);
router.get(
  "/teacher/:teacherId/allocated-subjects",
  verifyAdminJWT,
  viewAllAllocatedSubjectsOfTheTeacher
);
router.put(
  "/teacher/:teacherId/allocated-subject/:subjectId",
  verifyAdminJWT,
  editAllocatedSubjectOfTheTeacher
);
router.delete(
  "/teacher/:teacherId/allocated-subject/:subjectId",
  verifyAdminJWT,
  deleteAllocatedSubjectOfTheTeacher
);
router.post(
  "/register-student",
  verifyAdminJWT,
  upload.single("avatar"),
  registerStudent
);
router.get("/student/:studentId", verifyAdminJWT, getCurrentStudent);
router.patch(
  "/student/:studentId/update",
  verifyAdminJWT,
  updateStudentAccountDetails
);
router.post(
  "/subjects/student-allocate",
  verifyAdminJWT,
  allottSubjectsToStudents
);
router.get(
  "/students/:studentId/subjects",
  verifyAdminJWT,
  viewAllSubjectsAllottedToTheStudent
);
router.put(
  "/students/:studentId/subjects/:subjectId",
  verifyAdminJWT,
  editAllottedSubjectOfTheStudent
);
router.delete(
  "/students/:studentId/subjects/:subjectId",
  verifyAdminJWT,
  deleteAllottedSubjectOfTheStudent
);
router.post("/login", loginAdmin);
router.post("/logout", verifyAdminJWT, logoutAdmin);
router.get("/me", verifyAdminJWT, getCurrentAdmin);
router.patch("/me/update", verifyAdminJWT, updateAccountDetails);
router.put(
  "/me/avatar",
  verifyAdminJWT,
  upload.single("avatar"),
  updateAdminAvatar
);
router.get("/teachers", verifyAdminJWT, getAllTheTeachers);
router.get("/teachers/:teacherId", verifyAdminJWT, getTeacherPersonalInfo);
router.get(
  "/teachers/:teacherId/subjects/:subjectId/feedbacks",
  verifyAdminJWT,
  getSubjectFeedbacks
);
router.get(
  "/teachers/:teacherId/research-papers",
  verifyAdminJWT,
  getResearchPapersPublishedByTheTeacher
);
router.get(
  "/teachers/:teacherId/events-participated",
  verifyAdminJWT,
  getEventsParticipatedByTheTeacher
);
router.get(
  "/teachers/:teacherId/expert-lectures",
  verifyAdminJWT,
  getExpertLecturesDeliveredByTheTeacher
);
router.get(
  "/teachers/:teacherId/sttps",
  verifyAdminJWT,
  getSTTPConductedByTheTeacher
);
router.get(
  "/post/:teacherId",
  verifyAdminJWT,
  getAllContributions
);
router.get(
  "/teachers/:teacherId/students-guided/mtech",
  verifyAdminJWT,
  getMtechStudentsGuidedByTheTeacher
);
router.get(
  "/teachers/:teacherId/students-guided/phd",
  verifyAdminJWT,
  getPhdStudentsGuidedByTheTeacher
);
router.get(
  "/teachers/:teacherId/projects",
  verifyAdminJWT,
  getProjectsHeldByTheTeacher
);

router.get(
  "/teachers/:teacherId/seminars/attended",
  verifyAdminJWT,
  getAllseminarAttended
);

router.get(
  "/teachers/:teacherId/seminars/conducted",
  verifyAdminJWT,
  getSeminarsConductedByTheTeacher
);

router.get(
  "/teachers/:teacherId/seminars/upcoming",
  verifyAdminJWT,
  getUpcomingSeminarByTheTeacher
);
router.get(
  "/teachers/:teacherId/seminars/:seminarId/feedbacks",
  verifyAdminJWT,
  getConductedSeminarFeedbacks
);
router.get(
  "/teachers/:teacherId/lectures",
  verifyAdminJWT,
  getLecturesConductedByTheTeacher
);
router.put(
  "/student/:studentId/avatar",
  verifyAdminJWT,
  upload.single("avatar"),
  updateStudentAvatar
);
router.get("/subjects/allSubjects", verifyAdminJWT, getAllTheSubjects);
router.post(
  "/subjects/release-feedback",
  verifyAdminJWT,
  releaseAllFeedbackForms
);
router.post(
  "/teachers/release-feedback",
  verifyAdminJWT,
  releaseFeedbackForSubjects
);
router.get(
  "/subjects/:subjectId/feedback-cards",
  verifyAdminJWT,
  getAllFeedbackCards
);
router.get("/feedback/:feedbackId", verifyAdminJWT, getDetailedFeedback);
router.get("/subjects/:subjectId/submitters", verifyAdminJWT, getSubmitters);
router.get("/tasks/completed", verifyAdminJWT, viewCompletedTasks);
router.post("/tasks/assign", verifyAdminJWT, assignTasks);
router.get("/tasks/assigned", verifyAdminJWT, viewAssignedTasks);
router.get("/branches", verifyAdminJWT, getAllTheBranches);
router.get(
  "/branches/:branch/students",
  verifyAdminJWT,
  getAllTheStudentsOfParticularBranch
);
router.get("/book/:teacherId", verifyAdminJWT, getAllBooks);
router.get("/journal/:teacherId", verifyAdminJWT, getAllTheJournals);
router.get("/patent/:teacherId", verifyAdminJWT, getAllPatents);
router.get("/conference/:teacherId", verifyAdminJWT, getAllConferences);
router.get("/chapter/:teacherId", verifyAdminJWT, getAllChapters);

export default router;
