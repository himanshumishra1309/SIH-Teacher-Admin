import express from 'express';
import { addResearchWork, editResearchWork, getAllResearchWork, deleteOrCompleteResearchWork } from '../controllers/ongoing-research.controllers.js';
import { verifyTeacherJWT } from '../middleware/teacher.auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyTeacherJWT);

router.post('/add', addResearchWork);
router.patch('/edit/:id', editResearchWork);
router.get('/all', getAllResearchWork);
router.post('/delete-or-complete/:id', deleteOrCompleteResearchWork);

export default router;