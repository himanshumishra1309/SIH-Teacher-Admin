import express from 'express';
import {
    addWeightage,
    editWeightage,
    deleteWeightage,
    getAllWeightages
} from '../controllers/weightage.controllers.js';

const router = express.Router();

// Route to add a new weightage
router.post('/weightages', addWeightage);

// Route to edit an existing weightage
router.put('/weightages/:id', editWeightage);

// Route to delete a weightage
router.delete('/weightages/:id', deleteWeightage);

// Route to get all weightages
router.get('/weightages', getAllWeightages);

export default router;