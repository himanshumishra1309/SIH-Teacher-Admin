import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Journal2 } from "../models/journal.model.2.js";
import { PublicationPoint } from "../models/publication-points.models.js";
import mongoose from "mongoose";

const addJournal = asyncHandler(async (req, res) => {
  const { title, authors, publication, publicationDate, volume, issue, pages } =
    req.body;

  const owner = req.teacher._id;
  if (!title || !authors || !publicationDate || !volume || !issue || !pages) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  if (!mongoose.Types.ObjectId.isValid(publication)) {
    throw new ApiError(404, "Publication not found");
  }

  const publications = await PublicationPoint.findById(publication);

  const h5_index = publications.hindex;
  const h5_median = publications.median;

  const journalEntry = await Journal2.create({
    title,
    authors,
    publicationDate,
    volume,
    issue,
    pages,
    publication,
    h5_index,
    h5_median,
    owner,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, journalEntry, "Journal added successfully"));
});

const updateJournal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    authors,
    publicationDate,
    volume,
    issue,
    pages,
    publisher,
    journalType,
  } = req.body;

  if (
    !title ||
    !authors ||
    !journalType ||
    !publicationDate ||
    !volume ||
    !issue ||
    !pages ||
    !publisher
  ) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  const updatedJournal = await Journal2.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        authors,
        publicationDate,
        volume,
        issue,
        pages,
        publisher,
        journalType,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedJournal) {
    throw new ApiError(404, "Journal not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJournal, "Journal updated successfully"));
});

const deleteJournal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedJournal = await Journal.findByIdAndDelete(id);

  if (!deletedJournal) {
    throw new ApiError(404, "Journal not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Journal deleted successfully"));
});

const getAllJournals = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const owner = id;
  const journals = await Journal2.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, journals, "All journals retrieved successfully")
    );
});

export { addJournal, updateJournal, deleteJournal, getAllJournals };
