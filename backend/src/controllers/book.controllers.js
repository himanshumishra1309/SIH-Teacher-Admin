import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Book } from "../models/books.models.js";

const addBook = asyncHandler(async (req, res) => {
  const { title, authors, publicationDate, volume, pages, segregation } =
    req.body;

  const owner = req.teacher._id;

  if (
    !title ||
    !authors ||
    !publicationDate ||
    !volume ||
    !pages ||
    !segregation
  ) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  const bookEntry = await Book.create({
    title,
    authors,
    publicationDate,
    volume,
    pages,
    segregation,
    owner,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bookEntry, "Book added successfully"));
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, authors, publicationDate, volume, pages, segregation } =
    req.body;

  const updatedBook = await Book.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        authors,
        publicationDate,
        volume,
        pages,
        segregation,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedBook) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedBook = await Book.findByIdAndDelete(id);

  if (!deletedBook) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Book deleted successfully"));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const owner = req.teacher._id;
  const books = await Book.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, books, "All books retrieved successfully"));
});

export { addBook, updateBook, deleteBook, getAllBooks };
