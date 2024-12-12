import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { Book2 } from "../models/books.models.2.js";
import mongoose from "mongoose";
import { PublicationPoint } from "../models/publication-points.models.js";

// Add a new book
const addBook = asyncHandler(async (req, res) => {
  const { title, authors, publicationDate, volume, pages, publication, owner } =
    req.body;

  // console.log(publication);
  if (!mongoose.Types.ObjectId.isValid(publication)) {
    throw new ApiError(404, "Publication not found");
  }

  const publications = await PublicationPoint.findById(publication);

  if (!title || !authors || !publicationDate || !volume || !pages || !owner) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const h5_index = publications.hindex;
  const h5_median = publications.median;

  const book = await Book2.create({
    title,
    authors,
    publicationDate,
    volume,
    pages,
    publication,
    h5_index,
    h5_median,
    owner,
  });

  res.status(200).json(new ApiResponse(201, book, "Book added successfully"));
});

// Get all books
const getBooks = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "User not found");
  }

  const books = await Book2.find({ owner: id });
  res
    .status(200)
    .json(new ApiResponse(200, books, "Books retrieved successfully"));
});

// Update a book
const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let {
    title,
    authors,
    publicationDate,
    volume,
    pages,
    publication,
    h5_index,
    h5_median,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(publication)) {
    throw new ApiError(404, "Publication not found");
  }

  const publications = await PublicationPoint.findById(publication);

  h5_index = publications.hindex;
  h5_median = publications.median;

  if (
    !title ||
    !authors ||
    !publicationDate ||
    !volume ||
    !pages ||
    !h5_index ||
    !h5_median
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const book = await Book2.findById(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  book.title = title || book.title;
  book.authors = authors || book.authors;
  book.publicationDate = publicationDate || book.publicationDate;
  book.volume = volume || book.volume;
  book.pages = pages || book.pages;
  book.publication = publication || book.publication;
  book.h5_index = h5_index !== undefined ? h5_index : book.h5_index;
  book.h5_median = h5_median !== undefined ? h5_median : book.h5_median;

  const updatedBook = await book.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

// Delete a book
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book2.findOneAndDelete(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  //   const deletedBook = await book.deleteOne();

  res.status(200).json(new ApiResponse(200, book, "Book deleted successfully"));
});

export { addBook, getBooks, updateBook, deleteBook };
