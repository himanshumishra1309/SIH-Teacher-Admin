import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { STTP } from "../models/sttp.models.js";
import { uploadToGCS } from "../utils/googleCloud.js";
import path from "path";
import { Storage } from "@google-cloud/storage";
const storage = new Storage();

const uploadEvent = asyncHandler(async (req, res) => {
  const { topic, dailyDuration, startDate, endDate, venue } = req.body;
  const file = req.file;

  if (
    [topic, dailyDuration, startDate, endDate, venue].some(
      (field) => field.trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  if (!file) {
    throw new ApiError(400, 'PDF report file is required');
  }

  // Detect file type and set folder
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const folder = fileExtension === '.pdf' ? 'pdf-report' : 'images';

  // Upload file to the appropriate folder
  const fileUrl = await uploadToGCS(file.path, folder);

  if (!fileUrl) {
    throw new ApiError(500, 'Error in uploading file to Google Cloud');
  }

  const sttp = await STTP.create({
    topic,
    dailyDuration,
    startDate,
    endDate,
    venue,
    report: fileUrl, // Save the public URL
    addedOn: Date.now(),
    owner: req.teacher._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, sttp, 'STTP event created successfully'));
});

const showAllEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, sttps] = await Promise.all([
    STTP.countDocuments({ owner: req.teacher._id }),
    STTP.find({ owner: req.teacher._id })
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
        sttps,
      },
      "All the STTPs are now visible"
    )
  );
});

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { topic, duration, startDate, endDate, venue } = req.body;
  const file = req.file;

  const sttp = await STTP.findById(id);

  if (!sttp) {
    throw new ApiError(400, 'No such record found in STTP');
  }

  if (topic) sttp.topic = topic;
  if (duration) sttp.duration = duration;
  if (startDate) sttp.startDate = startDate;
  if (endDate) sttp.endDate = endDate;
  if (venue) sttp.venue = venue;

  // Handle file upload if a new file is provided
  if (file) {
    // // Delete the previous file from GCS if it exists
    // if (sttp.report) {
    //   const publicUrlParts = sttp.report.split('/');
    //   const fileName = publicUrlParts.slice(-2).join('/'); // Extract folder and filename
    //   await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).file(fileName).delete();
    // }

    // Detect file type and set folder
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const folder = fileExtension === '.pdf' ? 'pdf-reports' : 'images';

    // Upload the new file to the appropriate folder
    const fileUrl = await uploadToGCS(file.path, folder);

    // Check if the upload was successful
    if (!fileUrl) {
      throw new ApiError(500, 'Error in uploading new file to Google Cloud');
    }

    // Update the report field with the new public URL
    sttp.report = fileUrl;
  }

  await sttp.save();

  return res
    .status(200)
    .json(new ApiResponse(200, sttp, 'STTP event updated successfully'));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const result = await STTP.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(400, "no such file found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, null, "STTP removed successfully"));
});

export { uploadEvent, showAllEvents, updateEvent, deleteEvent };
