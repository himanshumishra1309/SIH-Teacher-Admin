import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Seminar } from "../models/seminars.models.js";
import { SeminarFeedback } from "../models/feedback-seminars.models.js";
import { uploadToGCS, deleteFromGCS } from "../utils/googleCloud.js";
import { SAttendance } from "../models/seminarAttendance.models.js";
import { Student } from "../models/students.models.js";

const uploadConductedSeminar = asyncHandler(async (req, res) => {
  const { topic, duration, date } = req.body;
  const owner = req.teacher._id;

  if (!topic || !duration || !date) {
    throw new ApiError(400, "All fields (topic, duration, date) are required.");
  }

  const reportPath = req.file?.path;

  if (!reportPath) {
    throw new ApiError(400, "Report is required.");
  }

  const reportUrl = reportPath
    ? await uploadToGCS(reportPath, "seminar-reports")
    : null;

  if (!reportUrl) {
    throw new ApiError(500, "Failed to upload");
  }

  const seminar = await Seminar.create({
    topic,
    duration,
    date,
    report: reportUrl,
    owner,
    feedbackReleased: false,
    activeUntil: new Date(),
  });

  res
    .status(201)
    .json(new ApiResponse(201, seminar, "Seminar uploaded successfully."));
});

const getConductedSeminars = asyncHandler(async (req, res) => {
  const owner = req.teacher._id;

  const seminars = await Seminar.find({ owner }).sort({ date: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, seminars, "Seminars fetched successfully."));
});

const editUploadedSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;
  const { topic, duration, date, deleteReport } = req.body;

  // Find the seminar
  const seminar = await Seminar.findById(seminarId);
  if (!seminar) {
    throw new ApiError(404, "Seminar not found");
  }

  // Update the basic details if provided
  if (topic) seminar.topic = topic;
  if (duration) seminar.duration = duration;
  if (date) seminar.date = new Date(date);

  // Handle report updates
  if (deleteReport && seminar.report) {
    await deleteFromGCS(seminar.report); // Remove the report from GCS
    seminar.report = undefined; // Clear the report field
  }

  if (req.file) {
    const reportUrl = await uploadToGCS(req.file.path, "reports");
    seminar.report = reportUrl; // Update with new report
  }

  await seminar.save();

  res
    .status(200)
    .json(new ApiResponse(200, seminar, "Seminar updated successfully"));
});

const deleteUploadedSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOneAndDelete({
    _id: seminarId,
    owner: req.teacher._id,
  });

  if (!seminar) {
    throw new ApiError(
      404,
      "Seminar not found or you're not authorized to delete it."
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, seminar, "Seminar deleted successfully."));
});

const releaseFeedbackForm = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOneAndUpdate(
    { _id: seminarId, owner: req.user._id },
    {
      feedbackReleased: true,
      activeUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  );

  if (!seminar) {
    throw new ApiError(
      404,
      "Seminar not found or you're not authorized to release feedback."
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, seminar, "Feedback form released successfully.")
    );
});

const viewFeedbacks = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const feedbacks = await SeminarFeedback.find({ seminar: seminarId }).select(
    "-student"
  );

  res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Feedbacks fetched successfully."));
});

const getFeedbackSubmitters = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const feedbacks = await SeminarFeedback.find({ seminar: seminarId }).populate(
    "student",
    "name roll_no"
  );

  const submitters = feedbacks.map((feedback) => feedback.student);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        submitters,
        "Feedback submitters fetched successfully."
      )
    );
});

const getStudentsByBranch = asyncHandler(async (req, res) => {
  const { branchName } = req.params;

  if (!branchName?.trim()) {
    throw new ApiError(400, "Branch name is required");
  }

  const students = await Student.find({ branch: branchName }).select(
    "name email roll_no branch year"
  );

  if (!students.length) {
    throw new ApiError(404, "No students found for the given branch");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const markAttendance = asyncHandler(async (req, res, next) => {
  const { seminarId, teacherId } = req.params;
  const { studentIds } = req.body; // Array of student IDs from the fetched students.

  // Validate the request
  if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    throw new ApiError("Please provide an array of student IDs.", 400);
  }

  // Check if the seminar exists
  const seminar = await Seminar.findById(seminarId);
  if (!seminar) {
    throw new ApiError("Seminar not found.", 404);
  }

  // Use the seminar's scheduled date for matching
  const seminarDate = seminar.date; // Assuming `date` is a field in the Seminar schema.

  // Validate that the provided student IDs exist
  const students = await Student.find({ _id: { $in: studentIds } });

  if (students.length === 0) {
    throw new ApiError("No students found for the provided IDs.", 404);
  }

  // Check if an attendance record already exists for this seminar, date, and teacher
  const existingRecord = await SAttendance.findOne({
    seminar: seminarId,
    date: seminarDate,
    teacher: teacherId,
  });

  if (existingRecord) {
    return next(
      new ApiError(
        "Attendance already marked for this seminar on this date.",
        400
      )
    );
  }

  // Create a new attendance record
  const attendanceRecord = SAttendance.create({
    seminar: seminarId,
    date: seminarDate,
    teacher: teacherId,
    studentsPresent: studentIds,
  });

  // Respond with success
  res
    .status(200)
    .json(
      new ApiResponse(200, attendanceRecord, "Attendance marked successfully.")
    );
});

const viewSeminarFeedbackFormsAvailable = asyncHandler(async (req, res) => {
  const studentId = req.student._id; // Assuming student is authenticated and `req.user` contains their details.

  const attendanceRecords = await SAttendance.find({
    studentsPresent: studentId,
  }).populate("seminar");

  const feedbackAvailableSeminars = attendanceRecords
    .filter((record) => record.seminar.feedbackReleased)
    .map((record) => ({
      seminarId: record.seminar._id,
      topic: record.seminar.topic,
      date: record.seminar.date,
      duration: record.seminar.duration,
      owner: record.seminar.owner,
    }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        feedbackAvailableSeminars,
        "Feedback forms available for the following seminars."
      )
    );
});

const fillEligibleFeedbackForm = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;
  const studentId = req.student._id;

  const seminar = await Seminar.findById(seminarId);
  if (!seminar) {
    return next(new ApiError("Seminar not found.", 404));
  }

  const attendanceRecord = await SAttendance.findOne({
    seminar: seminarId,
    studentsPresent: studentId,
    date: new Date().toISOString().split("T")[0],
  });

  if (!attendanceRecord) {
    return next(
      new ApiError(
        "You're not eligible to fill the feedback form for this seminar.",
        403
      )
    );
  }

  const { comments, rating } = req.body;

  if (!comments || !rating) {
    return next(new ApiError("Comments and rating are required.", 400));
  }

  const feedback = await SeminarFeedback.create({
    seminar: seminarId,
    comments,
    rating,
    student: studentId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback submitted successfully."));
});

export {
  uploadConductedSeminar,
  getConductedSeminars,
  editUploadedSeminar,
  deleteUploadedSeminar,
  releaseFeedbackForm,
  viewFeedbacks,
  getFeedbackSubmitters,
  markAttendance,
  viewSeminarFeedbackFormsAvailable,
  fillEligibleFeedbackForm,
  getStudentsByBranch,
};
