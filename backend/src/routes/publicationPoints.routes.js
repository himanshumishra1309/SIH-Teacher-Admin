import express from "express";
import {
  addPublicationPoint,
  getPublicationPoints,
  updatePublicationPoint,
  deletePublicationPoint,
  fetchAllTypes,
} from "../controllers/publicationPoints.controllers.js";

const router = express.Router();

// Route to add a new publication point
router.post("/", addPublicationPoint);

// Route to get all publication points
router.get("/", getPublicationPoints);

// Route to update a publication point by ID
router.put("/:id", updatePublicationPoint);

// Route to delete a publication point by ID
router.delete("/:id", deletePublicationPoint);

router.get("/all", fetchAllTypes);

export default router;
