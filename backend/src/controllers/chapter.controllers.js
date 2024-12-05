import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Chapter } from "../models/chapter.models.js";

const addChapter = asyncHandler(async (req, res) => {
  const {
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    chapterType,
  } = req.body;
  const owner = req.teacher._id;

  if (!title || !authors || !publicationDate || !chapterType) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  const chapterEntry = await Chapter.create({
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    chapterType,
    owner,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, chapterEntry, "Chapter added successfully"));
});

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
    chapterType,
  } = req.body;

  const updatedChapter = await Chapter.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        authors,
        publicationDate,
        book,
        volume,
        pages,
        publisher,
        chapterType,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedChapter) {
    throw new ApiError(404, "Chapter not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChapter, "Chapter updated successfully"));
});

const deleteChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedChapter = await Chapter.findByIdAndDelete(id);

  if (!deletedChapter) {
    throw new ApiError(404, "Chapter not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Chapter deleted successfully"));
});

const getAllChapters = asyncHandler(async (req, res) => {
  const owner = req.teacher._id;
  const chapters = await Chapter.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, chapters, "All chapters retrieved successfully")
    );
});

export { addChapter, updateChapter, deleteChapter, getAllChapters };
