import express from "express";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { verifyAdminJWT } from "../middleware/admin.auth.middleware.js";
import {
  completeJournalPoints,
  completeBooksPoints,
  completePatentPoints,
  completeProjectsPoints,
  completeConferencePoints,
  completeChapterPoints,
  completeSTTPPoints,
  completeEventsConductedPoints,
  completeSeminarAttendedPoints,
  completeExpertLecturesPoints,
  completeSeminarPoints,
  getComparativePointsData,
  calculateTeacherRanks,
  completeLecturePoints,
  completeStudentGuidedPoints,
  completeContributionPoints,
  completeJournal2Points,
  completeBooks2Points,
  completePatent2Points,
  completeConference2Points
} from '../controllers/points.controllers.js';

const router = express.Router();
 
router.get("/journals/:teacherId", verifyTeacherJWT, completeJournal2Points); // done
router.get("/books/:teacherId", verifyTeacherJWT, completeBooks2Points); // done
router.get("/patents/:teacherId", verifyTeacherJWT, completePatent2Points); // done
router.get("/projects/:teacherId", verifyTeacherJWT, completeProjectsPoints); // done
router.get("/conferences/:teacherId", verifyTeacherJWT, completeConference2Points); // done
router.get("/chapter/:teacherId", verifyTeacherJWT, completeChapterPoints); // done
router.get("/sttp/:teacherId", verifyTeacherJWT, completeSTTPPoints); // done
router.get("/events/:teacherId", verifyTeacherJWT, completeEventsConductedPoints); // done
router.get("/seminar-attended/:teacherId", verifyTeacherJWT, completeSeminarAttendedPoints); // done
router.get("/expert-lectures/:teacherId", verifyTeacherJWT, completeExpertLecturesPoints); 
router.get("/seminar/:teacherId", verifyTeacherJWT, completeSeminarPoints);
router.get("/lecture/:teacherId", verifyTeacherJWT, completeLecturePoints);
router.get("/student-guided/:teacherId", verifyTeacherJWT, completeStudentGuidedPoints);
router.get("/contribution/:teacherId", verifyTeacherJWT, completeContributionPoints);
router.get("/comparative", verifyTeacherJWT, getComparativePointsData);
router.get('/teacher-ranks', verifyTeacherJWT, calculateTeacherRanks);


router.get("/ad-journals/:teacherId", verifyAdminJWT, completeJournalPoints);
router.get("/ad-books/:teacherId", verifyAdminJWT, completeBooksPoints);
router.get("/ad-patents/:teacherId", verifyAdminJWT, completePatentPoints);
router.get("/ad-projects/:teacherId", verifyAdminJWT, completeProjectsPoints);
router.get("/ad-conferences/:teacherId", verifyAdminJWT, completeConferencePoints);
router.get("/ad-chapter/:teacherId", verifyAdminJWT, completeChapterPoints);
router.get("/ad-sttp/:teacherId", verifyAdminJWT, completeSTTPPoints);
router.get("/ad-events/:teacherId", verifyAdminJWT, completeEventsConductedPoints);
router.get("/ad-seminar-attended/:teacherId", verifyAdminJWT, completeSeminarAttendedPoints);
router.get("/ad-expert-lectures/:teacherId", verifyAdminJWT, completeExpertLecturesPoints);
router.get("/ad-seminar/:teacherId", verifyAdminJWT, completeSeminarPoints);
router.get("/ad-lecture/:teacherId", verifyAdminJWT, completeLecturePoints);
router.get("/ad-student-guided/:teacherId", verifyAdminJWT, completeStudentGuidedPoints);
router.get("/ad-contribution/:teacherId", verifyAdminJWT, completeContributionPoints);
router.get("/ad-comparative", verifyAdminJWT, getComparativePointsData);
router.get('/ad-teacher-ranks', verifyAdminJWT, calculateTeacherRanks);


export default router;
