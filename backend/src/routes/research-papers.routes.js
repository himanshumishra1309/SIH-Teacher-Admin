import { Router } from "express";
import { uploadPaper, showAllResearchPaper, updatePaper, deletePaper } from "../controllers/research-papers.controllers";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware";

const router = Router();
router.use(verifyTeacherJWT);

// router.route("/").post(uploadPaper);
// router.route("/").get(showAllResearchPaper)
// router.route("/paper/:id").patch(updatePaper)
// router.route("/paper/:id").delete(deletePaper)

router.route("/").post(uploadPaper).get(showAllResearchPaper)
router.route("/paper/:id").patch(updatePaper).delete(deletePaper)

export default router