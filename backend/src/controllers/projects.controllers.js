import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Project } from "../models/projects.models.js";
import { uploadToGCS } from "../utils/googleCloud.js";
import path from "path";
import { Storage } from "@google-cloud/storage";
const storage = new Storage();

// All the routes are done including update and delete also :)

const uploadProject = asyncHandler(async (req, res) => {
  const {
    topic,
    branch_name,
    daily_duration,
    projectType,
    startDate,
    endDate,
  } = req.body;
  const file = req.file;

  if (
    [topic, branch_name, daily_duration, projectType, startDate, endDate].some(
      (field) => field.trim === ""
    )
  ) {
    throw new ApiError(400, "All the fields are required");
  }

  if (!file) {
    throw new ApiError(200, "PDF report file is required");
  }

  // const uploadResponse = await uploadOnCloudinary(file.path);
  const uploadResponse = await uploadToGCS(file.path, "pdf-report");

  if (!uploadResponse) {
    throw new ApiError(500, "error in uploading file to Google Cloud");
  }

  const project = await Project.create({
    topic,
    branch_name,
    daily_duration,
    projectType,
    startDate,
    endDate,
    addedOn: Date.now(),
    report: uploadResponse, // Store Cloud URL
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

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(400, "No such record found in project");
  }

  if (topic) project.topic = topic;
  if (branch_name) project.branch_name = branch_name;
  if (daily_duration) project.daily_duration = daily_duration;
  if (startDate) project.startDate = startDate;
  if (endDate) project.endDate = endDate;

  if (file) {
    // Delete the previous file from GCS if it exists
    // if (expertLecture.report) {
    //   const publicUrlParts = expertLecture.report.split('/');
    //   const fileName = publicUrlParts.slice(-2).join('/'); // Extract folder and filename
    //   await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).file(fileName).delete();
    // }

    // Detect file type and set folder
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const folder = fileExtension === ".pdf" ? "pdf-reports" : "images";

    // Upload the new file to the appropriate folder
    const fileUrl = await uploadToGCS(file.path, folder);

    // Check if the upload was successful
    if (!fileUrl) {
      throw new ApiError(500, "Error in uploading new file to Google Cloud");
    }

    // Update the report field with the new public URL
    project.report = fileUrl;
  }

  await project.save();
  if (!project) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project event updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await Project.findOneAndDelete({ _id: id });

  if (!result) {
    throw new ApiError(400, "no such file found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, null, "Project removed successfully"));
});

export { uploadProject, showAllProjects, updateProject, deleteProject };
