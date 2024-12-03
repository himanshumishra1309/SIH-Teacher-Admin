import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { createContribution, getAllContribution } from "../controllers/extraContributions.controllers.js";

const router = Router();

router.post(
  "/post/create",
  verifyTeacherJWT,
  upload.fields([{ name: "images", maxCount: 10 }]),
  createContribution
);

router.get("/post/get", verifyTeacherJWT, getAllContribution);

// { name: 'report', maxCount: 1 }

export default router;
