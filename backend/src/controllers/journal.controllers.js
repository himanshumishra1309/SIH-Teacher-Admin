import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Journal } from "../models/journal.models.js";

const addJournal = asyncHandler(async (req, res) => {
  const {
    title,
    authors,
    journalType,
    publicationDate,
    journal,
    volume,
    issue,
    pages,
    publisher,
  } = req.body;
  const owner = req.teacher._id;

  if (
    !title ||
    !authors ||
    !journalType ||
    !publicationDate ||
    !journal ||
    !volume ||
    !issue ||
    !pages ||
    !publisher
  ) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  // changes should be revind later

  const journalEntry = await Journal.create({
    title,
    authors,
    publicationDate,
    journal,
    volume,
    issue,
    pages,
    publisher,
    journalType,
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
    journal,
    volume,
    issue,
    pages,
    publisher,
    journalType,
  } = req.body;

  const updatedJournal = await Journal.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        authors,
        publicationDate,
        journal,
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
  const owner = req.teacher._id;
  const journals = await Journal.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, journals, "All journals retrieved successfully")
    );
});

export { addJournal, updateJournal, deleteJournal, getAllJournals };
