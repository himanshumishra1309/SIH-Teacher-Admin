import express from 'express';
import { addSubject, showAllSubjects, editSubject, removeSubject } from '../controllers/allocated-subjects.controllers.js';
import { verifyTeacherJWT } from '../middleware/teacher.auth.middleware.js';

const router = express.Router();

// Route to add a new subject
router.post('/subjects', verifyTeacherJWT, addSubject); // done

// Route to show all subjects
router.get('/subjects/:teacherId', verifyTeacherJWT, showAllSubjects); // done

// Route to edit a subject
router.patch('/subjects/:id', verifyTeacherJWT, editSubject);

// Route to remove a subject
router.delete('/subjects/:id', verifyTeacherJWT, removeSubject);

export default router;