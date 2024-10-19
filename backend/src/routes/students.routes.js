import express from "express";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentStudent,
  updateAccountDetails,
  updateStudentAvatar,
} from "../controllers/students.controllers.js";
import { verifyStudentJWT } from "../middleware/student.auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Route to register a student
router.post("/register", upload.single("avatar"), registerStudent);

// Route to login a student
router.post("/login", loginStudent);

// Route to logout a student
router.post("/logout", verifyStudentJWT, logoutStudent);

// Route to get the current logged-in student's data
router.get("/me", verifyStudentJWT, getCurrentStudent);

// Route to update student account details
router.patch("/me/update", verifyStudentJWT, updateAccountDetails);

// Route to update student's avatar
router.put("/me/avatar", verifyStudentJWT, upload.single("avatar"), updateStudentAvatar);

export default router;
