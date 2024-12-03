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
} from "../controllers/points.controllers.js";

const router = express.Router();

// Middleware to verify either teacher or admin JWT
const verifyJWT = async (req, res, next) => {
  try {
    // Try verifying teacher JWT
    await verifyTeacherJWT(req, res, next);
  } catch {
    // If teacher JWT fails, try verifying admin JWT
    try {
      await verifyAdminJWT(req, res, next);
    } catch {
      return res.status(401).json({ message: "Unauthorized" }); // Both failed
    }
  }
};

// Apply the unified JWT middleware to all routes
router.use(verifyJWT);

// Individual point category routes
router.get("/journals", completeJournalPoints);
router.get("/books", completeBooksPoints);
router.get("/patents", completePatentPoints);
router.get("/projects", completeProjectsPoints);
router.get("/conferences", completeConferencePoints);
router.get("/chapter/:teacherId", completeChapterPoints);
router.get("/sttp", completeSTTPPoints);
router.get("/events/:teacherId", completeEventsConductedPoints);
router.get("/seminar-attended/:teacherId", completeSeminarAttendedPoints);
router.get("/expert-lectures", completeExpertLecturesPoints);
router.get("/seminar/:teacherId", completeSeminarPoints);

// Comparative data route
router.get("/comparative", getComparativePointsData);

export default router;
