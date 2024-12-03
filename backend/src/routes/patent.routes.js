import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addPatent, deletePatent, getAllPatents, updatePatent } from "../controllers/patent.controllers.js";

const router = Router();

router.post("/patent/add", verifyTeacherJWT, addPatent);
router.get("/patent/get", verifyTeacherJWT, getAllPatents);
router.patch("/patent/:updateId/update", verifyTeacherJWT, updatePatent);
router.delete("/patent/:deleteId/delete", verifyTeacherJWT, deletePatent);

export default router;