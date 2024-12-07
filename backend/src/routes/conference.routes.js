import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addConference, deleteConference, getAllConferences, updateConference } from "../controllers/conference.controllers.js";

const router = Router();

router.post("/conference/add", verifyTeacherJWT, addConference);
router.post("/conference/get", verifyTeacherJWT, getAllConferences);
router.patch("/conference/get/:id", verifyTeacherJWT, updateConference);
router.delete("/conference/delete/:id", verifyTeacherJWT, deleteConference);
router.get("/conference/:deleteId/", verifyTeacherJWT, getAllConferences);

export default router;