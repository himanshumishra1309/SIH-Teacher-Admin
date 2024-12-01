import express from 'express';
import {
  addPoints,
  updatePoints,
  deletePoints,
  getAllPoints,
} from '../controllers/domainPoints.controllers.js';
import { verifyAdminJWT } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// Routes for domain points
router.post('/points', verifyAdminJWT, addPoints);             // Add new domain points
router.put('/points/:domain', verifyAdminJWT, updatePoints);          // Update points for a domain
router.delete('/points/:domain', verifyAdminJWT, deletePoints); // Delete a domain
router.get('/points', verifyAdminJWT, getAllPoints);          // Get all domains and points

export default router;
