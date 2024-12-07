import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import {
  createContribution,
  editContribution,
  getAllContribution,
} from "../controllers/extraContributions.controllers.js";

const router = Router();
router.post(
  "/post/create",
  verifyTeacherJWT,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "report", maxCount: 1 },
  ]),
  createContribution
);

router.get("/post/get", verifyTeacherJWT, getAllContribution);

router.patch(
  "/post/update/:id",
  verifyTeacherJWT,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "report", maxCount: 1 },
  ]),
  editContribution
);

export default router;
