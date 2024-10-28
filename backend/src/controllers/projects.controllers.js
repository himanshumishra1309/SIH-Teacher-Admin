import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Project } from "../models/projects.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadProject = asyncHandler(async (req, res) => {
  const { topic, branch_name, daily_duration, startDate, endDate } = req.body;
  const file = req.file;

  if (
    [topic, branch_name, daily_duration, startDate, endDate].some(
      (field) => field.trim === ""
    )
  ) {
    throw new ApiError(400, "All the fields are required");
  }

  if (!file) {
    throw new ApiError(200, "PDF report file is required");
  }

  const uploadResponse = await uploadOnCloudinary(file.path);

  if (!uploadResponse) {
    throw new ApiError(500, "error in uploading file to cloudinary");
  }

  const project = await Project.create({
    topic,
    branch_name,
    daily_duration,
    startDate,
    endDate,
    addedOn: Date.now(),
    report: uploadResponse.secure_url, // Store Cloudinary URL
    owner: req.teacher._id, // Assuming authenticated user's ID
  });

  return res
    .status(200)
    .json(new ApiResponse(201, project, "Project event created successfully"));
});

const showAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, projects] = await Promise.all([
    Project.countDocuments({ owner: req.teacher._id }),
    Project.find({ owner: req.teacher._id })
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
        projects,
      },
      "All the Projects are now visible"
    )
  );
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { topic, branch_name, daily_duration, startDate, endDate } = req.body;
  const file = req.file;

  let updateFields = { topic, branch_name, daily_duration, startDate, endDate };

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(400, "No such record found in project");
  }

  // Handle file upload if a new file is provided
  if (file) {
    // Delete the previous file from Cloudinary if it exists
    if (project.report) {
      const publicId = project.report.split("/").pop().split(".")[0]; // Extract the public_id from the Cloudinary URL
      await cloudinary.uploader.destroy(publicId);
    }

    // Upload the new file to Cloudinary
    const uploadResponse = await uploadOnCloudinary(file.path);

    // Check if the upload was successful
    if (!uploadResponse) {
      throw new ApiError(500, "Error in uploading new file to Cloudinary");
    }

    // Update the report field with the new Cloudinary URL
    updateFields.report = uploadResponse.secure_url;
  }

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedProject) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProject, "Project event updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await Project.findById(id);

  if (!result) {
    throw new ApiError(400, "no such file found");
  }

  await result.remove();

  return res
    .status(200)
    .json(new ApiResponse(201, null, "Project removed successfully"));
});

export { uploadProject, showAllProjects, updateProject, deleteProject };
