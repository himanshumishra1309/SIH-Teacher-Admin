import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addBook, getBooks, deleteBook, updateBook } from "../controllers/book.controllers.2.js";

const router = Router();

router.post("/book/add", addBook);
router.get("/book/:id", getBooks);
router.patch("/book/:id", verifyTeacherJWT, updateBook);
router.delete("/book/delete/:id", verifyTeacherJWT, deleteBook);

export default router;
