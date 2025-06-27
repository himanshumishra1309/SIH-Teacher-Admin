import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chapter2 } from "../models/chapter.models.2.js";
import { ApiError } from "../utils/ApiErrors.js";
import mongoose from "mongoose";
import { PublicationPoint } from "../models/publication-points.models.js";

// Add a new chapter
const addChapter = asyncHandler(async (req, res) => {
  const {
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    publication,
    owner,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(publication)) {
    throw new ApiError(404, "Publication not found");
  }

  const publications = await PublicationPoint.findById(publication);

  const h5_index = publications.hindex;
  const h5_median = publications.median;

  if (!title || !authors || !publicationDate || !publication || !owner) {
    throw new ApiError(
      400,
      "Required fields: title, authors, publicationDate, publication, owner"
    );
  }

  const chapter = await Chapter2.create({
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    publication,
    h5_index,
    h5_median,
    owner,
  });

  if (chapter) {
    res
      .status(201)
      .json(new ApiResponse(201, chapter, "Chapter added successfully"));
  } else {
    throw new ApiError(500, "Failed to add chapter");
  }
});

// Get all chapters
const getChapters = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "User not found");
  }

  const chapters = await Chapter2.find({ owner: id }).populate(
    "owner",
    "name email"
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, chapters, "All the chapters retrieved successfully")
    );
});

// Update a chapter
const updateChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
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

  const chapter = await Chapter2.findById(id);

  if (!chapter) {
    throw new ApiError(404, "Chapter not found");
  }

  chapter.title = title || chapter.title;
  chapter.authors = authors || chapter.authors;
  chapter.publicationDate = publicationDate || chapter.publicationDate;
  chapter.book = book || chapter.book;
  chapter.volume = volume || chapter.volume;
  chapter.pages = pages || chapter.pages;
  chapter.publisher = publisher || chapter.publisher;
  chapter.publication = publication || chapter.publication;
  chapter.h5_index = h5_index !== undefined ? h5_index : chapter.h5_index;
  chapter.h5_median = h5_median !== undefined ? h5_median : chapter.h5_median;

  const updatedChapter = await chapter.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedChapter, "Chapter updated successfully"));
});

// Delete a chapter
const deleteChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chapter = await Chapter2.findById(id);

  if (!chapter) {
    throw new ApiError(400, "Chapter not found");
  }

  await chapter.deleteOne();

  res.status(200).json(new ApiResponse(200, "Chapter deleted successfully"));
});

export { addChapter, getChapters, updateChapter, deleteChapter };
