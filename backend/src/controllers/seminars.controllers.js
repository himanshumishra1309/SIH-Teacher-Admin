import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Seminar } from "../models/seminars.models.js";
import { SeminarRSVP } from "../models/rsvp-seminar.models.js";
import { SeminarFeedback } from "../models/feedback-seminars.models.js";
import { Student } from "../models/students.models.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
}); //worked on postman

// 2. Post Upcoming Seminar
const postUpcomingSeminar = asyncHandler(async (req, res) => {
  const { topic, duration, date } = req.body;

  if (!topic || !duration || !date) {
    throw new ApiError(400, "Topic, duration, and date are required");
  }

  // Ensure duration is a number
  const durationInHours = Number(duration);
  if (isNaN(durationInHours)) {
    throw new ApiError(400, "Duration must be a number");
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
}); // worked on postman

// 3. See Feedbacks of a Particular Seminar (Teacher)
const seeFeedbacks = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.teacher._id,
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

  if(feedbacks.length === 0) {
    throw new ApiError(404, "No feedbacks found for this seminar");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Feedbacks fetched successfully"));
}); // send "_id"

// 4. Edit Info of a Conducted Seminar
const editConductedSeminarReport = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;
  const file = req.file;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.teacher._id,
    status: "conducted",
  });

  if (!seminar) {
    throw new ApiError(404, "Conducted seminar not found or not owned by you");
  }

  // Handle report file upload
  if (file) {
    // Remove the old report from Cloudinary if it exists
    if (seminar.report) {
      const publicId = seminar.report.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const uploadSeminarReport = await uploadOnCloudinary(file.path);
    if (!uploadSeminarReport) {
      throw new ApiError(500, "Couldn't upload your new file");
    }
    seminar.report = uploadSeminarReport.secure_url;
  }

  await seminar.save();

  return res
    .status(200)
    .json(new ApiResponse(200, seminar, "Report updated successfully"));
}); // worked on postman

// 5. Delete a Conducted Seminar
const deleteConductedSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOneAndDelete({
    _id: seminarId,
    owner: req.teacher._id,
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
}); // worked on postman

// 6. See Who All RSVPed for the Upcoming Seminar (Teacher)
const seeRSVPedStudents = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.teacher._id,
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
    owner: req.teacher._id,
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
    { $match: { owner: req.teacher._id, status: "upcoming" } },
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
}); // worked on postman

// 10. Mark Seminar as Conducted and Release Feedback Forms (Teacher)
const conductSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Report file is required");
  }

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.teacher._id,
    status: "upcoming",
  });

  if (!seminar) {
    throw new ApiError(404, "Upcoming seminar not found or not owned by you");
  }

  // Handle the report upload
  const uploadSeminarReport = await uploadOnCloudinary(file.path);
  if (!uploadSeminarReport) {
    throw new ApiError(500, "Couldn't upload your report file");
  }
  seminar.report = uploadSeminarReport.secure_url;
  seminar.status = "conducted";
  
  await seminar.save();

  // Fetch the seminar with additional data if needed
  const updatedSeminar = await Seminar.findById(seminarId)
    .populate("feedbacks")
    .populate("owner", "name department");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedSeminar,
      "Seminar marked as conducted and feedback forms released"
    )
  );
}); // worked on postman

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
    student: req.teacher._id,
  });
  if (existingRSVP) {
    throw new ApiError(400, "Already RSVPed for this seminar");
  }

  await SeminarRSVP.create({
    seminar: seminarId,
    student: req.teacher._id,
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
    student: req.teacher._id,
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

// 13. 
const getPendingFeedbackFormsForConductedSeminars = asyncHandler(async (req, res) => {
  const studentId = req.student._id;

  // Find all RSVP'd seminars that are conducted and where feedback is not submitted
  const rsvps = await SeminarRSVP.find({ student: studentId, submittedFeedback: false })
    .populate({
      path: "seminar",
      match: { status: "conducted" },
      select: "topic date"
    })
    .select("seminar submittedFeedback");

  // Filter out RSVP entries where seminar is null (not conducted)
  const pendingFeedbackForms = rsvps
    .filter(rsvp => rsvp.seminar)
    .map(rsvp => ({
      seminar: rsvp.seminar,
      submittedFeedback: rsvp.submittedFeedback
    }));

  return res.status(200).json(new ApiResponse(200, pendingFeedbackForms, "Pending feedback forms fetched successfully"));
});

// 14. Edit Upcoming Seminar
const editUpcomingSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;
  const { topic, duration, date } = req.body;

  const seminar = await Seminar.findOne({
    _id: seminarId,
    owner: req.teacher._id,
    status: "upcoming",
  });

  if (!seminar) {
    throw new ApiError(404, "Upcoming seminar not found or not owned by you");
  }

  // Update seminar fields if provided in the request body
  if (topic) seminar.topic = topic;
  if (duration) seminar.duration = duration;
  if (date) seminar.date = date;

  await seminar.save();

  return res
    .status(200)
    .json(new ApiResponse(200, seminar, "Seminar updated successfully"));
});

// 15. Cancel Upcoming Seminar
const cancelUpcomingSeminar = asyncHandler(async (req, res) => {
  const { seminarId } = req.params;

  const seminar = await Seminar.findOneAndDelete({
    _id: seminarId,
    owner: req.teacher._id,
    status: "upcoming",
  });

  if (!seminar) {
    throw new ApiError(404, "Upcoming seminar not found or not owned by you");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Seminar cancelled successfully"));
});


export {
  getAllConductedSeminars,
  postUpcomingSeminar,
  seeFeedbacks,
  editConductedSeminarReport,
  deleteConductedSeminar,
  seeRSVPedStudents,
  seeFeedbackSubmitters,
  getAllUpcomingSeminarsForStudents,
  getAllUpcomingSeminarsByTeacher,
  conductSeminar,
  studentRSVP,
  studentSubmitFeedback,
  getPendingFeedbackFormsForConductedSeminars,
  editUpcomingSeminar,
  cancelUpcomingSeminar
};
