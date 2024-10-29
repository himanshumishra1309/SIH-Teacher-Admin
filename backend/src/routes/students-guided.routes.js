import express from 'express';
import { uploadStudentInfo, showAllMtechStudent, showAllPhdStudent, editStudentInfo, deleteStudentInfo } from '../controllers/students-guided.controllers.js'; // adjust the path accordingly
import { verifyTeacherJWT } from '../middleware/teacher.auth.middleware.js'; // Middleware to verify the teacher's JWT token

const router = express.Router();

// Route to upload new student information
router.post('/upload', verifyTeacherJWT, uploadStudentInfo);

// Route to get all MTech students
router.get('/mtech-students', verifyTeacherJWT, showAllMtechStudent);

// Route to get all PhD students
router.get('/phd-students', verifyTeacherJWT, showAllPhdStudent);

// Route to update student information by ID
router.put('/:id', verifyTeacherJWT, editStudentInfo);

// Route to delete student information by ID
router.delete('/:id', verifyTeacherJWT, deleteStudentInfo);

export default router;
