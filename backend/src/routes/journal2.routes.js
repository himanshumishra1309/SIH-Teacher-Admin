import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addJournal, deleteJournal, getAllJournals, updateJournal } from "../controllers/journal.controllers.2.js"; 

const router = Router();

router.post("/journal/add", addJournal);
router.get("/journal/:id", getAllJournals);
router.patch("/journal/edit/:id", verifyTeacherJWT, updateJournal);
router.delete("/journal/delete/:id", verifyTeacherJWT, deleteJournal);

export default router;