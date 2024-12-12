import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PublicationPoint } from "../models/publication-points.models.js";
import { ApiError } from "../utils/ApiErrors.js";

const fetchAllTypes = asyncHandler(async (req, res) => {
  const types = await PublicationPoint.find({}, "_id name"); // Project only name and ID

  if (!types || types.length === 0) {
    throw new ApiError(404, "No publication types found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, types, "Publication types retrieved successfully")
    );
});

// Add a new publication point
const addPublicationPoint = asyncHandler(async (req, res) => {
  const { name, hindex, median } = req.body;

  if (!name || hindex === undefined || median === undefined) {
    throw new ApiError(400, "All fields (name, hindex, median) are required");
  }

  const existingPublication = await PublicationPoint.findOne({ name });
  if (existingPublication) {
    throw new ApiError(400, "Publication with this name already exists");
  }

  const publication = await PublicationPoint.create({ name, hindex, median });

  if (publication) {
    res
      .status(201)
      .json(
        new ApiResponse(201, publication, "Publication added successfully")
      );
  } else {
    throw new ApiError(500, "Failed to add publication");
  }
});

// Get all publication points
const getPublicationPoints = asyncHandler(async (req, res) => {
  const publications = await PublicationPoint.find();
  res.status(200).json(new ApiResponse(200, publications));
});

// Update a publication point
const updatePublicationPoint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, hindex, median } = req.body;

  const publication = await PublicationPoint.findById(id);

  if (!publication) {
    throw new ApiError(400, "Publication not found");
  }

  publication.name = name || publication.name;
  publication.hindex = hindex !== undefined ? hindex : publication.hindex;
  publication.median = median !== undefined ? median : publication.median;

  const updatedPublication = await publication.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPublication,
        "Publication updated successfully"
      )
    );
});

// Delete a publication point
const deletePublicationPoint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const publication = await PublicationPoint.findById(id);

  if (!publication) {
    throw new ApiError(404, "Publication not found");
  }

  await publication.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Publication deleted successfully"));
});

export {
  addPublicationPoint,
  getPublicationPoints,
  updatePublicationPoint,
  deletePublicationPoint,
  fetchAllTypes,
};
