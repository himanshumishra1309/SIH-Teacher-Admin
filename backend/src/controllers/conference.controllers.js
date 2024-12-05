import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Conference } from "../models/conferences.models.js";

const addConference = asyncHandler(async (req, res) => {
  const { title, authors, publicationDate, conference, volume, issue, pages, conferenceType } = req.body;
  const owner = req.teacher._id;

  if (!title || !authors || !publicationDate || !conference || !conferenceType) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  const conferenceEntry = await Conference.create({
    title,
    authors,
    publicationDate,
    conference,
    volume,
    issue,
    pages,
    conferenceType,
    owner,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, conferenceEntry, "Conference added successfully"));
});

const updateConference = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, authors, publicationDate, conference, volume, issue, pages, conferenceType } = req.body;

  const updatedConference = await Conference.findByIdAndUpdate(id, 
    {
      $set:{ 
        title, 
        authors,
        publicationDate, 
        conference, 
        volume, 
        issue, 
        pages, 
        conferenceType 
      }
    }, {
    new: true,
  });

  if (!updatedConference) {
    throw new ApiError(404, "Conference not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedConference, "Conference updated successfully"));
});

const deleteConference = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedConference = await Conference.findByIdAndDelete(id);

  if (!deletedConference) {
    throw new ApiError(404, "Conference not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Conference deleted successfully"));
});

const getAllConferences = asyncHandler(async (req, res) => {
  const owner = req.teacher._id;
  const conferences = await Conference.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, conferences, "All conferences retrieved successfully"));
});

export { addConference, updateConference, deleteConference, getAllConferences };
