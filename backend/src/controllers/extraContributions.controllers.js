import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Contribution } from "../models/extraContributions.models.js";
import { uploadToGCS, deleteFromGCS } from "../utils/googleCloud.js";
import path from "path";

const getAllContribution = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, contributions] = await Promise.all([
    Contribution.countDocuments({ owner: req.teacher._id }),
    Contribution.find({ owner: req.teacher._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page,
        pages: Math.ceil(total / limit),
        contributions,
      },
      "All the contributions are now visible"
    )
  );
});

const createContribution = asyncHandler(async (req, res) => {
  const { title, description, contributionType } = req.body;
  const files = req.files || {};

  if (!title || !description || !contributionType) {
    throw new ApiError(
      400,
      "Title, description, and contribution type are required"
    );
  }

  const images = [];
  if (files.images) {
    for (const file of files.images) {
      const result = await uploadToGCS(file.path, "images");
      if (!result) {
        throw new ApiError(
          500,
          "Failed to upload one or more images. Please try again."
        );
      }
      images.push(result);
    }
  }

  let report = null;
  if (files.report) {
    const result = await uploadToGCS(files.report[0].path, "pdf-reports");
    if (!result) {
      throw new ApiError(500, "Failed to upload the report. Please try again.");
    }
    report = result;
  }

  const contribution = await Contribution.create({
    title,
    description,
    images,
    report,
    contributionType,
    owner: req.teacher._id,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, contribution, "Contribution created successfully")
    );
});

const editContribution = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    contributionType,
    deleteImages = [],
    deleteReport,
  } = req.body;
  const files = req.files || {};

  const contribution = await Contribution.findById(id);
  if (!contribution) {
    throw new ApiError(404, "Contribution not found");
  }

  if (contribution.owner.toString() !== req.teacher._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this Contribution"
    );
  }

  // Update basic fields
  if (title) contribution.title = title;
  if (description) contribution.description = description;
  if (contributionType) contribution.contributionType = contributionType;

  // Handle images to delete
  if (deleteImages.length) {
    for (const imageUrl of deleteImages) {
      const fileName = path.basename(imageUrl);
      await deleteFromGCS(fileName, "images");
    }
    contribution.images = contribution.images.filter(
      (img) => !deleteImages.includes(img)
    );
  }

  // Handle new image uploads
  if (files.images) {
    for (const file of files.images) {
      const result = await uploadToGCS(file.path, "images");
      if (!result) {
        throw new ApiError(
          500,
          "Failed to upload one or more images. Please try again."
        );
      }
      contribution.images.push(result);
    }
  }

  // Handle report deletion and upload
  if (deleteReport && contribution.report) {
    const reportFileName = path.basename(contribution.report);
    await deleteFromGCS(reportFileName, "pdf-report");
    contribution.report = null;
  }

  if (files.report) {
    const result = await uploadToGCS(files.report[0].path, "pdf-report");
    if (!result) {
      throw new ApiError(500, "Failed to upload the report. Please try again.");
    }
    contribution.report = result.secure_url; // Correct placement of result
  }

  // Save the updated contribution
  await contribution.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, contribution, "Contribution updated successfully")
    );
});

const deleteContribution = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contribution = await Contribution.findById(id);
  if (!contribution) {
    throw new ApiError(404, "Contribution not found");
  }

  if (contribution.owner.toString() !== req.teacher._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this Contribution"
    );
  }

  for (const imageUrl of contribution.images) {
    const fileName = path.basename(imageUrl);
    await deleteFromGCS(fileName, "images");
  }

  if (contribution.report) {
    const reportFileName = path.basename(contribution.report);
    await deleteFromGCS(reportFileName, "pdf-report");
  }

  await contribution.remove();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Contribution deleted successfully"));
});

export {
  createContribution,
  editContribution,
  getAllContribution,
  deleteContribution,
};
