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
    calculateTeacherRanks
} from '../controllers/points.controllers.js';

const router = express.Router();

// Middleware to verify either teacher or admin JWT
// const verifyJWT = async (req, res, next) => {
//   try {
//     // Try verifying teacher JWT
//     await verifyTeacherJWT(req, res, next);
//   } catch {
//     // If teacher JWT fails, try verifying admin JWT
//     try {
//       await verifyAdminJWT(req, res, next);
//     } catch {
//       return res.status(401).json({ message: "Unauthorized" }); // Both failed
//     }
//   }
// };

// // Apply the unified JWT middleware to all routes
// router.use(verifyJWT);

// Individual point category routes
router.get("/journals/:teacherId", verifyTeacherJWT, completeJournalPoints);
router.get("/books/:teacherId", verifyTeacherJWT, completeBooksPoints);
router.get("/patents/:teacherId", verifyTeacherJWT, completePatentPoints);
router.get("/projects/:teacherId", verifyTeacherJWT, completeProjectsPoints);
router.get("/conferences/:teacherId", verifyTeacherJWT, completeConferencePoints);
router.get("/chapter/:teacherId", verifyTeacherJWT, completeChapterPoints);
router.get("/sttp/:teacherId", verifyTeacherJWT, completeSTTPPoints);
router.get("/events/:teacherId", verifyTeacherJWT, completeEventsConductedPoints);
router.get("/seminar-attended/:teacherId", verifyTeacherJWT, completeSeminarAttendedPoints);
router.get("/expert-lectures/:teacherId", verifyTeacherJWT, completeExpertLecturesPoints);
router.get("/seminar/:teacherId", verifyTeacherJWT, completeSeminarPoints);

// Comparative data route
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

// Comparative data route
router.get("/comparative", verifyAdminJWT, getComparativePointsData);

router.get('/teacher-ranks', verifyAdminJWT, calculateTeacherRanks);


export default router;
