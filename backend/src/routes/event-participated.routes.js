import express from 'express';
import { uploadParticipatedEvent, showAllParticipatedEvent, editParticipatedEvent, deleteParticipatedEvent } from '../controllers/eventParticipationController.js';
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware";
import { upload } from "../middleware/multer.middleware"; // Assuming you're importing the multer config

const router = express.Router();

// Route to upload a participated event
router.post('/events', verifyTeacherJWT, upload.single('report'), uploadParticipatedEvent);

// Route to show all participated events
router.get('/events', verifyTeacherJWT, showAllParticipatedEvent);

// Route to edit a participated event (file upload is optional)
router.patch('/events/:id', verifyTeacherJWT, upload.single('report'), editParticipatedEvent);

// Route to delete a participated event
router.delete('/events/:id', verifyTeacherJWT, deleteParticipatedEvent);

export default router;
