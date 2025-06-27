import express from "express";
import {
  addNewLecture,
  editLecture,
  deleteLecture,
  getLectureById,
  fetchAllStudents,
  markLectureAttendance,
  viewAttendanceOfALecture,
} from "../controllers/lectures.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";

const router = express.Router();

// Route to add a new lecture
router.post("/:subjectId/:teacherId/lectures", verifyTeacherJWT, addNewLecture);

// Route to edit a lecture
router.put("/:lecturId/:teacherId/lectures", verifyTeacherJWT, editLecture);

// Route to delete a lecture
router.delete("/:lectureId/lectures", verifyTeacherJWT, deleteLecture);

// Route to get lectures by subject and teacher
router.get("/:subjectId/:teacherId/lectures", verifyTeacherJWT, getLectureById);

// Route to fetch all students for a subject
router.get("/:subjectId/students", verifyTeacherJWT, fetchAllStudents);

// Route to mark attendance for a lecture
router.post("/:lectureId/attendance", verifyTeacherJWT, markLectureAttendance);

// Route to get the attendace of the Lecture
router.get(
  "/:lectureId/viewattendance",
  verifyTeacherJWT,
  viewAttendanceOfALecture
);

export default router;
