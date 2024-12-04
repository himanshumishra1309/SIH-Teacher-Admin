import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addChapter } from "../controllers/chapter.controllers.js";
import { getAllChapters } from "../controllers/chapter.controllers.js";

const router = Router();

router.post("/chapter/add", verifyTeacherJWT, addChapter);
router.get("/chapter/", verifyTeacherJWT, getAllChapters);

export default router;
