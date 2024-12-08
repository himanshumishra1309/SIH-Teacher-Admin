import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import {
  loginTeacher,
  logoutTeacher,
  getTeacherProfile,
} from "../controllers/teachers.controllers.js";
import { getTeacherGraph } from "../controllers/graph.controller.js";

const router = Router();

router.route("/login").post(loginTeacher);
router.route("/logout").post(verifyTeacherJWT, logoutTeacher);
router.route("/me").get(verifyTeacherJWT, getTeacherProfile);
router.post("/me/graph", verifyTeacherJWT, getTeacherGraph);


export default router;
