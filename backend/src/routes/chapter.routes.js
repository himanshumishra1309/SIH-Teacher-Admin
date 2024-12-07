import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addChapter, deleteChapter, updateChapter } from "../controllers/chapter.controllers.js";
import { getAllChapters } from "../controllers/chapter.controllers.js";

const router = Router();

router.post("/chapter/add", verifyTeacherJWT, addChapter);
router.get("/chapter/", verifyTeacherJWT, getAllChapters);
router.patch("/chapter/edit/:id", verifyTeacherJWT, updateChapter);
router.delete("/chapter/delete/:id", verifyTeacherJWT, deleteChapter);



export default router;
