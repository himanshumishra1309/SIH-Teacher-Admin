import express from "express";
import {
  loginStudent,
  logoutStudent,
  getStudentProfile
} from "../controllers/students.controllers.js";
import { verifyStudentJWT } from "../middleware/student.auth.middleware.js";

const router = express.Router();

// Route to login a student
router.post("/login", loginStudent);

// Route to logout a student
router.post("/logout", verifyStudentJWT, logoutStudent);

// Route to get student profile
router.get("/me", verifyStudentJWT, getStudentProfile);

export default router;
