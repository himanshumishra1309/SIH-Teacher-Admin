import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { EventParticipation } from "../models/events-participated.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadToGCS } from "../utils/googleCloud.js";

// All routes checked, including delete and update

const uploadParticipatedEvent = asyncHandler(async (req, res) => {
  const { role, event_name, date, event_type } = req.body;
  const report = req.file;
  const owner = req.teacher._id;

  if (!role || !event_name || !date || !report || !event_type) {
    throw new ApiError(400, "Please fill all fields");
  }

  console.log("Report path:", report.path);

  // const uploadedReport = await uploadOnCloudinary(report.path);
  const uploadResponse = await uploadToGCS(report.path, "pdf-report");

  if (!uploadResponse) {
    throw new ApiError(500, "Error in uploading report to Cloudinary");
  }

  const eventParticipation = await EventParticipation.create({
    role,
    event_name,
    event_type,
    date,
    report: uploadResponse,
    owner,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        eventParticipation,
        "Participation added successfully"
      )
    );
});

const showAllParticipatedEvent = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, events] = await Promise.all([
    EventParticipation.countDocuments({ owner: req.teacher._id }),
    EventParticipation.find({ owner: req.teacher._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner")
      .lean(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page,
        pages: Math.ceil(total / limit),
        events,
      },
      "All participated events are now visible"
    )
  );
});

const editParticipatedEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, event, date } = req.body;
  const report = req.file;

  let updateFields = { role, event, date };

  const eventParticipation = await EventParticipation.findById(id);

  if (!eventParticipation) {
    throw new ApiError(404, "Event not found");
  }

  if (report) {
    if (eventParticipation.report) {
      const publicId = eventParticipation.report.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const uploadedReport = await uploadOnCloudinary(report.path);

    if (!uploadedReport) {
      throw new ApiError(500, "Error in uploading report to Cloudinary");
    }

    updateFields.report = uploadedReport.secure_url;
  }

  const updatedEventParticipation = await EventParticipation.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedEventParticipation) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedEventParticipation,
        "Event updated successfully"
      )
    );
});

const deleteParticipatedEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await EventParticipation.findByIdAndDelete(id);

  if (!event) {
    throw new ApiError(400, "No such file found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Event details deleted successfully"));
});

export {
  uploadParticipatedEvent,
  showAllParticipatedEvent,
  editParticipatedEvent,
  deleteParticipatedEvent,
};
