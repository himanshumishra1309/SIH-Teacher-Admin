import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addBook, getAllBooks } from "../controllers/book.controllers.js";


const router = Router();

router.post("/book/add", verifyTeacherJWT, addBook);
router.get("/book/", verifyTeacherJWT, getAllBooks);


export default router;
