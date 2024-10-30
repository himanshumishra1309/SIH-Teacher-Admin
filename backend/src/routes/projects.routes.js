import express from 'express';
import { 
    uploadProject, 
    showAllProjects, 
    updateProject, 
    deleteProject 
} from '../controllers/projects.controllers.js';
import { verifyTeacherJWT } from '../middleware/teacher.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';


const router = express.Router();

// Route to upload a new project
router.post('/projects', verifyTeacherJWT, upload.single('report'), uploadProject);

// Route to show all projects with pagination
router.get('/projects', verifyTeacherJWT, showAllProjects);

// Route to update an existing project
router.patch('/projects/:id', verifyTeacherJWT, upload.single('report'), updateProject);

// Route to delete a project
router.delete('/projects/:id', verifyTeacherJWT, deleteProject);

export default router;
