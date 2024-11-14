import { Router } from "express";
import {
  uploadPaper,
  showAllResearchPaper,
  updatePaper,
  deletePaper,
} from "../controllers/research-papers.controllers.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";

const   router = Router();
router.use(verifyTeacherJWT);

// router.route("/").post(uploadPaper);
// router.route("/").get(showAllResearchPaper)
// router.route("/paper/:id").patch(updatePaper)
// router.route("/paper/:id").delete(deletePaper)

router.route("/papers").post(uploadPaper);
router.route("/allPapers").get(showAllResearchPaper);
router.route("/paper/:id").patch(updatePaper).delete(deletePaper);

export default router;
