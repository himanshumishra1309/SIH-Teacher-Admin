import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { registerTeacher, loginTeacher, logoutTeacher, getCurrentTeacher, updateTeacherAvatar, updateAccountDetails } from "../controllers/teachers.controllers.js";
import { getTeacherGraph } from "../controllers/graph.controller.js";

const router = Router();

router.route('/register').post(
    upload.single('avatar'),
    registerTeacher
);

router.route('/login').post(loginTeacher);
router.route('/logout').post(verifyTeacherJWT, logoutTeacher);
router.route('/me').get(verifyTeacherJWT, getCurrentTeacher);
router.route('/me/update').patch(verifyTeacherJWT, updateAccountDetails);
router.route('/me/avatar').put(
    verifyTeacherJWT,
    upload.single('avatar'),
    updateTeacherAvatar
);
router.get('/me/graph', verifyTeacherJWT, getTeacherGraph);

export default router;
