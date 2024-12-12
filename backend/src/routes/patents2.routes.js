import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import {
  addPatent,
  deletePatent,
  getAllPatents,
  updatePatent,
} from "../controllers/patents.controller.2.js";

const router = Router();

router.post("/patent/add", verifyTeacherJWT, addPatent);
router.get("/patent/get/:id", getAllPatents);
router.patch("/patent/:id", verifyTeacherJWT, updatePatent);
router.delete("/patent/:id", verifyTeacherJWT, deletePatent);

export default router;
