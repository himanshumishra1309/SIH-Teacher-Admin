import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { EventParticipation } from "../models/events-participated.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadParticipatedEvent = asyncHandler(async (req, res) => {
  const { role, event, date } = req.body;
  const report = req.file;
  const owner = req.teacher._id;

  if (!role || !event || !date || !report) {
    throw new ApiError(400, "Please fill all fields");
  }

  console.log("Report path:", report.path);

  const uploadedReport = await uploadOnCloudinary(report.path);

  if (!uploadedReport) {
    throw new ApiError(500, "Error in uploading report to cloudinary");
  }

  const eventParticipation = await EventParticipation.create({
    role,
    event,
    date,
    report: uploadedReport.secure_url,
    owner,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        eventParticipation,
        "participation fetched Succesfully"
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
      .limit(limit),
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
      throw new ApiError(500, "Error in uploading report to cloudinary");
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
  const [total, events] = await Promise.all([
    EventParticipation.countDocuments({ owner: req.teacher._id }),
    EventParticipation.find({ owner: req.teacher._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

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

  const event = await EventParticipation.findById(id);

  if (!event) {
    throw new ApiError(400, "no such file found");
  }

  await event.remove();

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
