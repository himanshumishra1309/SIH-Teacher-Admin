import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addJournal, deleteJournal, getAllJournals, updateJournal } from "../controllers/journal.controllers.js";

const router = Router();

router.post("/journal/add", verifyTeacherJWT, addJournal);
router.get("/journal/", verifyTeacherJWT, getAllJournals);
router.post("/journal/:id/update", verifyTeacherJWT, updateJournal);
router.post("/journal/:id/delete", verifyTeacherJWT, deleteJournal);

export default router;