import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../controllers/book.controllers.js";

const router = Router();

router.post("/book/add", verifyTeacherJWT, addBook);
router.get("/book/", verifyTeacherJWT, getAllBooks);
router.patch("/book/edit/:id", verifyTeacherJWT, updateBook);
router.delete("/book/delete/:id", verifyTeacherJWT, deleteBook);


export default router;
