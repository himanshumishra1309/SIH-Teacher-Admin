import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { LectureFeedback } from "../models/lectureFeedbacks.models.js";

const getAllFeedbackCards = asyncHandler(async (req, res) => {
  const {
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
    teacherId,
  } = req.body;

  // Validate query parameters
  if (
    !subject_name ||
    !subject_code ||
    !subject_credit ||
    !branch ||
    !year ||
    !teacherId
  ) {
    throw new ApiError(
      400,
      "All fields (subject_name, subject_code, subject_credit, branch, year) are required."
    );
  }

  // Fetch all feedback matching the specified subject details
  const feedbackData = await LectureFeedback.find({
    subject_name: subject_name,
    subject_code: subject_code,
    subject_credit: subject_credit,
    teacher: teacherId,
    branch: branch,
    year: year,
  })
    .sort({ submissionTime: -1 }) // Sort by most recent submission
    .lean();

  // If no feedback is found, return an error
  if (!feedbackData || feedbackData.length === 0) {
    throw new ApiError(404, "No feedback found for the specified subject.");
  }

  // Prepare response: anonymized cards with average ratings and comments
  const feedbackCards = feedbackData.map((feedback) => {
    const averageRating = (
      (feedback.question1_rating +
        feedback.question2_rating +
        feedback.question3_rating +
        feedback.question4_rating +
        feedback.question5_rating +
        feedback.question6_rating +
        feedback.question7_rating +
        feedback.question8_rating +
        feedback.question9_rating +
        feedback.question10_rating) /
      10
    ).toFixed(2);

    return {
      feedbackId: feedback._id,
      comment: feedback.comment,
      averageRating,
      submissionTime: feedback.submissionTime,
    };
  });

  // Send the feedback cards as the response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        feedbackCards,
        "Feedback cards fetched successfully."
      )
    );
});

const getDetailedFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  // Validate input
  if (!feedbackId) {
    throw new ApiError(400, "Feedback ID is required.");
  }

  // Fetch feedback by ID
  const feedback = await LectureFeedback.findById(feedbackId).lean();

  if (!feedback) {
    throw new ApiError(404, "Feedback not found.");
  }

  // Prepare detailed feedback response
  const detailedFeedback = {
    subject_name: feedback.subject_name,
    subject_code: feedback.subject_code,
    subject_credit: feedback.subject_credit,
    branch: feedback.branch,
    year: feedback.year,
    ratings: {
      question1: feedback.question1_rating,
      question2: feedback.question2_rating,
      question3: feedback.question3_rating,
      question4: feedback.question4_rating,
      question5: feedback.question5_rating,
      question6: feedback.question6_rating,
      question7: feedback.question7_rating,
      question8: feedback.question8_rating,
      question9: feedback.question9_rating,
      question10: feedback.question10_rating,
    },
    comment: feedback.comment,
    submissionTime: feedback.submissionTime,
  };

  // Send the detailed feedback as the response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        detailedFeedback,
        "Detailed feedback fetched successfully."
      )
    );
});

const getSubmitters = asyncHandler(async (req, res) => {
  const {
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
    teacherId,
  } = req.body;

  // console.log(subject_code);

  // Validate input
  if (
    !subject_name ||
    !subject_code ||
    !subject_credit ||
    !branch ||
    !year ||
    !teacherId
  ) {
    throw new ApiError(
      400,
      "All fields (subject_name, subject_code, subject_credit, branch, year, teacherId) are required."
    );
  }

  // Fetch feedback for the specified subject and teacher
  const feedbackData = await LectureFeedback.find({
    subject_name: subject_name,
    subject_code: subject_code,
    subject_credit: subject_credit,
    branch: branch,
    year: year,
    teacher: teacherId,
  })
    .select("submitter submissionTime") // Only fetch submitter and submission time
    .populate("submitter", "name email roll_no") // Populate student details if needed
    .lean();

  // If no feedback is found, return an error
  if (!feedbackData || feedbackData.length === 0) {
    throw new ApiError(
      404,
      "No feedback found for the specified subject and teacher."
    );
  }

  // Prepare response: List of submitters with submission times
  const submitters = feedbackData.map((feedback) => ({
    submitter: feedback.submitter
      ? feedback.submitter.name || "Anonymous"
      : "Anonymous",
    rollNumber: feedback.submitter?.roll_no || "N/A", // Include rollNumber if required
    submissionTime: feedback.submissionTime,
  }));

  // Send the submitters as the response
  return res
    .status(200)
    .json(new ApiResponse(200, submitters, "Submitters fetched successfully."));
});

export { getAllFeedbackCards, getDetailedFeedback, getSubmitters };
