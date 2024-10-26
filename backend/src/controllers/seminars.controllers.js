import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Seminar } from "../models/seminars.models.js";
import { SeminarRSVP } from "../models/rsvp-seminar.models.js";
import { SeminarFeedback } from "../models/feedback-seminars.models.js";
import { Student } from "../models/students.models.js";

// 1. Get All Conducted Seminars (with feedback and report)
const getAllConductedSeminars = asyncHandler(async (req, res) => {
  const conductedSeminars = await Seminar.aggregate([
    { $match: { status: "conducted", owner: req.teacher._id } },
    {
      $lookup: {
        from: "seminarfeedbacks",
        localField: "_id",
        foreignField: "seminar",
        as: "feedbacks",
      },
    },
    {
      $lookup: {
        from: "teachers",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        topic: 1,
        duration: 1,
        date: 1,
        report: 1,
        owner: "$ownerDetails.name",
        department: "$ownerDetails.department",
        feedbacks: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        conductedSeminars,
        "Conducted seminars fetched successfully"
      )
    );
});

// 2. Post Upcoming Seminar
const postUpcomingSeminar = asyncHandler(async (req, res) => {
  const { topic, duration, date } = req.body;

  if (!topic || !duration || !date) {
    throw new ApiError(400, "Topic, duration, and date are required");
  }

  const newSeminar = await Seminar.create({
    topic,
    duration,
    date,
    owner: req.teacher._id,
    status: "upcoming",
    report: "",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newSeminar, "Upcoming seminar posted successfully")
    );
});

// 3. See Feedbacks of a Particular Seminar (Teacher)
const seeFeedbacks = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.user._id,
    status: "conducted",
  });
  if (!seminar) {
    throw new ApiError(404, "Conducted seminar not found or not owned by you");
  }

  const feedbacks = await SeminarFeedback.aggregate([
    { $match: { seminar: seminar._id } },
    {
      $lookup: {
        from: "seminarrsvps",
        localField: "rsvp",
        foreignField: "_id",
        as: "rsvpDetails",
      },
    },
    { $unwind: "$rsvpDetails" },
    {
      $project: {
        comments: 1,
        rating: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Feedbacks fetched successfully"));
}); // send "_id"

// 4. Edit Info of a Conducted Seminar
const editConductedSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;
  const { topic, duration, date, report } = req.body;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.user._id,
    status: "conducted",
  });
  if (!seminar) {
    throw new ApiError(404, "Conducted seminar not found or not owned by you");
  }

  if (topic) seminar.topic = topic;
  if (duration) seminar.duration = duration;
  if (date) seminar.date = date;
  if (report) seminar.report = report;

  await seminar.save();

  return res
    .status(200)
    .json(new ApiResponse(200, seminar, "Seminar updated successfully"));
});

// 5. Delete a Conducted Seminar
const deleteConductedSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOneAndDelete({
    _id: seminarId,
    owner: req.user._id,
    status: "conducted",
  });
  if (!seminar) {
    throw new ApiError(404, "Conducted seminar not found or not owned by you");
  }

  await SeminarRSVP.deleteMany({ seminar: seminarId });
  await SeminarFeedback.deleteMany({ seminar: seminarId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Conducted seminar deleted successfully"));
});

// 6. See Who All RSVPed for the Upcoming Seminar (Teacher)
const seeRSVPedStudents = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.user._id,
    status: "upcoming",
  });
  if (!seminar) {
    throw new ApiError(404, "Upcoming seminar not found or not owned by you");
  }

  const rsvps = await SeminarRSVP.aggregate([
    { $match: { seminar: seminar._id } },
    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "studentDetails",
      },
    },
    { $unwind: "$studentDetails" },
    {
      $project: {
        name: "$studentDetails.name",
        branch: "$studentDetails.branch",
        email: "$studentDetails.email",
        roll_no: "$studentDetails.roll_no",
        year: "$studentDetails.year",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, rsvps, "RSVPed students fetched successfully"));
});

// 7. See Who All Submitted Feedback for the Seminar (Teacher)
const seeFeedbackSubmitters = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.user._id,
    status: "conducted",
  });
  if (!seminar) {
    throw new ApiError(404, "Conducted seminar not found or not owned by you");
  }

  const feedbacks = await SeminarFeedback.aggregate([
    { $match: { seminar: seminar._id } },
    {
      $lookup: {
        from: "seminarrsvps",
        localField: "rsvp",
        foreignField: "_id",
        as: "rsvpDetails",
      },
    },
    { $unwind: "$rsvpDetails" },
    {
      $lookup: {
        from: "students",
        localField: "rsvpDetails.student",
        foreignField: "_id",
        as: "studentDetails",
      },
    },
    { $unwind: "$studentDetails" },
    {
      $project: {
        name: "$studentDetails.name",
        branch: "$studentDetails.branch",
        year: "$studentDetails.year",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        feedbacks,
        "Feedback submitters fetched successfully"
      )
    );
});

// 8. See All Upcoming Seminars (Student)
const getAllUpcomingSeminarsForStudents = asyncHandler(async (req, res) => {
  const seminars = await Seminar.aggregate([
    { $match: { status: "upcoming", date: { $gte: new Date() } } },
    {
      $lookup: {
        from: "teachers",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        topic: 1,
        duration: 1,
        date: 1,
        owner: "$ownerDetails.name",
        department: "$ownerDetails.department",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, seminars, "Upcoming seminars fetched successfully")
    );
});

// 9. See All Upcoming Seminars Posted by the Teacher (Teacher)
const getAllUpcomingSeminarsByTeacher = asyncHandler(async (req, res) => {
  const seminars = await Seminar.aggregate([
    { $match: { owner: req.user._id, status: "upcoming" } },
    {
      $lookup: {
        from: "teachers",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        topic: 1,
        duration: 1,
        date: 1,
        owner: "$ownerDetails.name",
        department: "$ownerDetails.department",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        seminars,
        "Your upcoming seminars fetched successfully"
      )
    );
});

// 10. Mark Seminar as Conducted and Release Feedback Forms (Teacher)
const conductSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.body;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.user._id,
    status: "upcoming",
  });
  if (!seminar) {
    throw new ApiError(404, "Upcoming seminar not found or not owned by you");
  }

  seminar.status = "conducted";
  await seminar.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        seminar,
        "Seminar marked as conducted and feedback forms released"
      )
    );
});

// 11. Student RSVP for Seminars
const studentRSVP = asyncHandler(async (req, res) => {
  const { seminarId } = req.body;

  if (!seminarId) {
    throw new ApiError(400, "Seminar ID is required");
  }

  const seminar = await Seminar.findOne({ _id: seminarId, status: "upcoming" });
  if (!seminar) {
    throw new ApiError(404, "Upcoming seminar not found");
  }

  const existingRSVP = await SeminarRSVP.findOne({
    seminar: seminarId,
    student: req.user._id,
  });
  if (existingRSVP) {
    throw new ApiError(400, "Already RSVPed for this seminar");
  }

  await SeminarRSVP.create({
    seminar: seminarId,
    student: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, null, "RSVP successful"));
});

// 12. Student Fill Feedback Form
const studentSubmitFeedback = asyncHandler(async (req, res) => {
  const { seminarId, rating, comments } = req.body;

  if (!seminarId || !rating || !comments) {
    throw new ApiError(400, "Seminar ID, rating, and comments are required");
  }

  const seminar = await Seminar.findOne({
    _id: seminarId,
    status: "conducted",
  });
  if (!seminar) {
    throw new ApiError(404, "Conducted seminar not found");
  }

  const rsvp = await SeminarRSVP.findOne({
    seminar: seminarId,
    student: req.user._id,
  });
  if (!rsvp) {
    throw new ApiError(400, "You have not RSVPed for this seminar");
  }

  if (rsvp.submittedFeedback) {
    throw new ApiError(400, "Feedback already submitted");
  }

  await SeminarFeedback.create({
    seminar: seminarId,
    rsvp: rsvp._id,
    comments,
    rating,
  });

  rsvp.submittedFeedback = true;
  await rsvp.save();

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Feedback submitted successfully"));
});

export {
  getAllConductedSeminars,
  postUpcomingSeminar,
  seeFeedbacks,
  editConductedSeminar,
  deleteConductedSeminar,
  seeRSVPedStudents,
  seeFeedbackSubmitters,
  getAllUpcomingSeminarsForStudents,
  getAllUpcomingSeminarsByTeacher,
  conductSeminar,
  studentRSVP,
  studentSubmitFeedback,
};
