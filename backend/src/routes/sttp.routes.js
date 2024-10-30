import express from "express";
import {
  uploadEvent,
  showAllEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/sttp.controllers.js"; // adjust the path accordingly
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js"; // For handling file uploads (Multer middleware)

const router = express.Router();

// Route to upload a new STTP event
router.post("/upload", verifyTeacherJWT, upload.single("report"), uploadEvent);

// Route to show all STTP events (paginated)
router.get("/", verifyTeacherJWT, showAllEvents);

// Route to update an STTP event by ID
router.put("/:id", verifyTeacherJWT, upload.single("report"), updateEvent);

// Route to delete an STTP event by ID
router.delete("/:id", verifyTeacherJWT, deleteEvent);

export default router;