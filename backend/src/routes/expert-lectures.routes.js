import express from 'express';
import { uploadExpertLecture, showAllExpertLecture, updateExpertLecture, deleteExpertLecture } from '../controllers/expert-lectures.controllers.js';
import { verifyTeacherJWT } from '../middleware/teacher.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js'; // Assuming you're using Multer for file handling

const router = express.Router();

// Route to upload an expert lecture
router.post('/lectures', verifyTeacherJWT, upload.single('report'), uploadExpertLecture);

// Route to show all expert lectures with pagination
router.get('/lectures', verifyTeacherJWT, showAllExpertLecture);

// Route to update an expert lecture
router.patch('/lectures/:id', verifyTeacherJWT, upload.single('report'), updateExpertLecture);

// Route to delete an expert lecture
router.delete('/lectures/:id', verifyTeacherJWT, deleteExpertLecture);

export default router;