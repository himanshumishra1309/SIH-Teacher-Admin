import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";
import { StudySubject } from "../models/studySubjects.models.js";
import { FeedbackForm } from "../models/feedbackformstatus.models.js";
import { LectureFeedback } from "../models/lectureFeedbacks.models.js";
import { Student } from "../models/students.models.js";

const releaseSingleFeedbackForm = asyncHandler(async (req, res) => {
    const { subjectId } = req.params; // Subject ID to release feedback for
  
    // Verify that the subject belongs to the teacher (owner)
    const subject = await AllocatedSubject.findOne({
      _id: subjectId,
      owner: req.user._id,
    });
  
    if (!subject) {
      throw new ApiError(404, "Subject not found or not assigned to you");
    }
  
    // Check if feedback for this subject is already released and active
    const existingFeedbackForm = await FeedbackForm.findOne({
      subject: subject._id,
      isActive: true,
    });
  
    if (existingFeedbackForm) {
      throw new ApiError(400, "Feedback form is already active for this subject");
    }
  
    // Create a new feedback form with 2 days of availability
    const releasedAt = new Date();
    const expiresAt = moment(releasedAt).add(2, "days").toDate();
  
    const feedbackForm = await FeedbackForm.create({
      subject: subject._id,
      releasedAt,
      expiresAt,
      isActive: true,
    });
  
    // Optionally, update the subject with feedbackForm reference
    subject.feedbackForm = feedbackForm._id;
    await subject.save();
  
    // Send response
    return res.status(200).json(
      new ApiResponse(200, feedbackForm, "Feedback form released successfully")
    );
});

const releaseAllFeedbackForm = asyncHandler(async(req, res)=>{
    // get all the subjects taught by that particular teacher:
    const subjects = await AllocatedSubject.find({owner: req.user._id});

    if(!subjects || subjects.length === 0){
        throw new ApiError(404, "No subjects found for this teacher");
    }

    const feedbackForms = [];

    // Loop through each subject and create a feedback form if not already active
    for (const subject of subjects) {
        // Check if feedback for this subject is already active
        const existingFeedbackForm = await FeedbackForm.findOne({
            subject: subject._id,
            isActive: true,
        });

        if (existingFeedbackForm) {
            continue; // Skip subjects that already have active feedback forms
        }

        // Create a new feedback form with 2 days of availability
        const releasedAt = new Date();
        const expiresAt = moment(releasedAt).add(2, "days").toDate();

        const feedbackForm = await FeedbackForm.create({
            subject: subject._id,
            releasedAt,
            expiresAt,
            isActive: true,
        });

        // Optionally, update the subject with feedbackForm reference
        subject.feedbackForm = feedbackForm._id;
        await subject.save();

        feedbackForms.push(feedbackForm); // Collect all released feedback forms
    }

    // If no feedback forms were created, return an appropriate message
    if (feedbackForms.length === 0) {
        throw new ApiError(400, "All subjects already have active feedback forms");
    }

    // Send response with all released feedback forms
    return res.status(200).json(
        new ApiResponse(200, feedbackForms, "Feedback forms released for all subjects successfully")
    );
})

const getReleasedFeedbackForms = asyncHandler(async(req, res)=>{
    // get the id of the logged in user:
    const studentId = req.user._id;

    // get all the subjects of the student:
    const enrolledSubjects = await StudySubject.find({owner: studentId})
    .select("subject_name subject_code subject_credit");

    if(!enrolledSubjects || enrolledSubjects.length === 0){
        throw new ApiError(404, "No subjects found for this student");
    }

        // Step 2: Extract subject details to match in the FeedbackForm
    const enrolledSubjectDetails = enrolledSubjects.map(subject => ({
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        subject_credit: subject.subject_credit,
    }));

    // Step 3: Fetch active feedback forms matching the enrolled subjects, branch, and year
    const feedbackForms = await FeedbackForm.aggregate([
    {
      $lookup: {
        from: "allocatedsubjects", // Collection for teacher's allocated subjects
        localField: "subject",
        foreignField: "_id",
        as: "subjectDetails",
      },
    },
    { $unwind: "$subjectDetails" },
    {
      $match: {
        isActive: true, // Active feedback forms
        expiresAt: { $gte: new Date() }, // Not expired
        $or: enrolledSubjectDetails.map(subject => ({
          "subjectDetails.subject_code": subject.subject_code,
          "subjectDetails.subject_name": subject.subject_name,
          "subjectDetails.subject_credit": subject.subject_credit,
          "subjectDetails.branch": req.user.branch, // Match student's branch
          "subjectDetails.year": req.user.year,     // Match student's year
        })),
      },
    },
    {
        $project: {
            subject_name: 1,
            subject_code: 1,
            subject_credit: 1,
            feedbackForm: {
              releasedAt: 1,
              expiresAt: 1,
            },
        },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, feedbackForms, "Feedback forms fetched successfully"));
});

// Controller to submit feedback for a feedback form
const fillFeedbackForm = asyncHandler(async (req, res) => {
  const { feedbackFormId } = req.params; // FeedbackForm ID from URL
  const { rating, comment } = req.body; // Feedback data
  const studentId = req.user._id; // Logged-in student's ID

  // Validate input
  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required");
  }

  // Step 1: Retrieve the FeedbackForm
  const feedbackForm = await FeedbackForm.findById(feedbackFormId)
    .populate({
      path: 'subject',
      select: 'subject_code subject_name subject_credit branch year',
      model: 'AllocatedSubject',
    });

  if (!feedbackForm) {
    throw new ApiError(404, "Feedback form not found");
  }

  // Step 2: Check if FeedbackForm is active and not expired
  const currentTime = new Date();
  if (!feedbackForm.isActive || feedbackForm.expiresAt < currentTime) {
    throw new ApiError(403, "Feedback form is not active or has expired");
  }

  // Step 3: Retrieve Student Details
  const student = await Student.findById(studentId).select('branch year');
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Step 4: Verify Enrollment in the Subject
  const enrolledSubject = await StudySubject.findOne({
    owner: studentId,
    subject_code: feedbackForm.subject.subject_code,
    subject_name: feedbackForm.subject.subject_name,
    subject_credit: feedbackForm.subject.subject_credit,
  });

  if (!enrolledSubject) {
    throw new ApiError(403, "You are not enrolled in this subject");
  }

  // Step 5: Verify Student's Branch and Year Match the Subject's Branch and Year
  if (student.branch !== feedbackForm.subject.branch || student.year !== feedbackForm.subject.year) {
    throw new ApiError(403, "Your branch or year does not match the subject's requirements");
  }

  // Step 6: Check for Existing Feedback Submission
  const existingFeedback = await LectureFeedback.findOne({
    feedbackForm: feedbackForm._id,
    owner: studentId,
  });

  if (existingFeedback) {
    throw new ApiError(400, "You have already submitted feedback for this form");
  }

  // Step 7: Create Feedback Entry
  const feedback = await LectureFeedback.create({
    subject_name: feedbackForm.subject.subject_name,
    subject_code: feedbackForm.subject.subject_code,
    subject_credit: feedbackForm.subject.subject_credit,
    branch: student.branch,
    year: student.year,
    rating,
    comment,
    owner: studentId,
    feedbackForm: feedbackForm._id,
  });

  if (!feedback) {
    throw new ApiError(500, "Failed to submit feedback");
  }

  return res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
});

// Controller function to get feedback for a specific subject taught by a teacher
const getFeedbackForSubject = asyncHandler(async (req, res) => {
  const { subject_name, subject_code, subject_credit, branch, year } = req.params; // Extract parameters from request
  const teacherId = req.user._id; // Assuming teacher's user info is stored in req.user

  // Step 1: Verify the teacher teaches the specified subject
  const subject = await AllocatedSubject.findOne({
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
    owner: teacherId,  // Ensure the teacher owns this subject
  });

  if (!subject) {
    throw new ApiError(404, "No subject found for this teacher with the provided details.");
  }

  // Step 2: Query to find feedback that matches the subject information
  const feedback = await LectureFeedback.find({
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
  });

  if (!feedback || feedback.length === 0) {
    throw new ApiError(404, "No feedback found for this subject.");
  }

  // Step 3: Return feedback (ratings and comments) to the teacher
  return res.status(200).json(new ApiResponse(200, feedback, "Feedback fetched successfully."));
});

const getStudentDetails = asyncHandler(async (req, res) => {
  const { subject_name, subject_code, subject_credit, branch, year } = req.params; // Extract parameters from request
  const teacherId = req.user._id; // Assuming teacher's user info is stored in req.user

  // Step 1: Verify the teacher teaches the specified subject
  const subject = await AllocatedSubject.findOne({
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
    owner: teacherId,  // Ensure the teacher owns this subject
  });

  if (!subject) {
    throw new ApiError(404, "No subject found for this teacher with the provided details.");
  }

  // Step 2: Query to find feedback that matches the subject information
  const feedbacks = await LectureFeedback.find({
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
  }).populate('owner', 'name branch year'); // Populate owner field with student details

  if (!feedbacks || feedbacks.length === 0) {
    throw new ApiError(404, "No feedback found for this subject.");
  }

  // Step 3: Extract student details from the feedback
  const studentList = feedbacks.map(feedback => ({
    studentName: feedback.owner.name,
    studentBranch: feedback.owner.branch,
    studentYear: feedback.owner.year,
  }));

  // Step 4: Return the student list
  return res.status(200).json(new ApiResponse(200, studentList, "Student details fetched successfully."));
});


export { releaseSingleFeedbackForm, releaseAllFeedbackForm, getReleasedFeedbackForms, fillFeedbackForm, getFeedbackForSubject, getStudentDetails };