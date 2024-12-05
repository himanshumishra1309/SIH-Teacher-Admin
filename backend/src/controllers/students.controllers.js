import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Student } from "../models/students.models.js";
import { StudySubject } from "../models/studySubjects.models.js";
import { Attendance } from "../models/lectureAttendance.models.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";
import { LectureFeedback } from "../models/lectureFeedbacks.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const student = await Student.findById(userId);
    const studentAccessToken = student.generateAccessToken();
    const studentRefreshToken = student.generateRefreshToken();

    student.refreshToken = studentRefreshToken;

    await student.save({ validateBeforeSave: false }); // this is inbuilt in mongoDB to save the info, but there is one problem with this thing and that it will invoke the password field and to stop that we put an object and make it false the thing that we put in the object is validateBeforeSave

    return { studentAccessToken, studentRefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const loginStudent = asyncHandler(async (req, res) => {
  //Todos:
  //1] Get data from req.body
  //2] give either name or email based entry
  //3] Find the user
  //4] Check the password
  //5] Generate access and refresh token and share it to the user
  //6] Send the token in the form of tokens
  //7] Send the response

  console.log("request : ", req);
  console.log("request's body : ", req.body);
  const { email, password } = req.body;

  //this logic is to check if the name or the email is correct, we cant write it this way : !name || !email
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  //this is used to find anyone from the database, by checking the name or email, whichever matches will return
  const user = await Student.findOne({ email });

  //if we didnot get anything then return that user DNE
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // we are not using 'User' rather we will use 'user' which is returned above, because 'User' is an instance of the moongoose of mongoDB and user is the data returned from the data base which signifies a single user and user.models.js file contain all the methods which can be accessed here such as isPasswordCorrect or refreshToken or accessToken
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { studentAccessToken, studentRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await Student.findById(user._id).select(
    "-password -refreshToken"
  );

  //now we will be adding functionality to return cookies, and for doing that securely such that the frontend could access those cookies but cannot modify them and also the cookies can only be modified using the backend server
  const options = {
    httpOnly: true,
    secure: true,
  };

  // cookie("accessToken", accessToken, options) this is the way of generating
  return res
    .status(200)
    .cookie("studentAccessToken", studentAccessToken, options)
    .cookie("studentRefreshToken", studentRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          studentAccessToken,
          studentRefreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.student._id).select(
    "-password -refreshToken"
  );

  if (!student) {
    throw new ApiError(404, "User does not exist");
  }

  return res.status(200).json(new ApiResponse(200, student, "User profile"));
});

const getFeedbackForms = asyncHandler(async (req, res) => {
  const studentId = req.student._id;

  // Step 1: Fetch the student's branch and year from the Student model
  const student = await Student.findById(studentId)
    .select("branch year")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const { branch, year } = student;

  // Step 2: Fetch all subjects the student is studying
  const studentSubjects = await StudySubject.find({
    student: studentId,
  })
    .populate("teacher", "name") // Populate teacher with only the 'name' field
    .lean();

  if (!studentSubjects || studentSubjects.length === 0) {
    throw new ApiError(404, "No subjects found for the student.");
  }

  // Step 3: Initialize array to store eligible subjects for feedback
  const eligibleSubjects = [];

  for (const subject of studentSubjects) {
    // Fetch total lectures for the subject
    const totalLectures = await Attendance.find({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      subject_credit: subject.subject_credit,
      teacher: subject.teacher,
      branch: branch,
      year: year,
    }).countDocuments();

    if (totalLectures === 0) {
      continue;
    }
    // Fetch lectures attended by the student for this subject
    const attendedLectures = await Attendance.find({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      subject_credit: subject.subject_credit,
      teacher: subject.teacher,
      branch: branch,
      year: year,
      studentsPresent: studentId,
    }).countDocuments();

    // Calculate attendance percentage
    const attendancePercentage = (attendedLectures / totalLectures) * 100;

    if (attendancePercentage >= 60) {
      // Check if feedback is released for this subject
      const allocatedSubject = await AllocatedSubject.findOne({
        subject_name: subject.subject_name,
        subject_code: subject.subject_code,
        subject_credit: subject.subject_credit,
        branch: branch,
        year: year,
        teacher: subject.teacher,
      }).lean();

      if (allocatedSubject && allocatedSubject.feedbackReleased) {
        eligibleSubjects.push({
          subject_name: subject.subject_name,
          subject_code: subject.subject_code,
          subject_credit: subject.subject_credit,
          teacher: subject.teacher,
          attendancePercentage: attendancePercentage.toFixed(2),
          branch : branch
        });
      }
    }
  }

  if (eligibleSubjects.length === 0) {
    throw new ApiError(
      403,
      "No feedback forms are available for the student due to attendance eligibility or unreleased feedback."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        eligibleSubjects,
        "Eligible feedback forms fetched successfully."
      )
    );
});

const fillFeedbackForm = asyncHandler(async (req, res) => {
  const studentId = req.student._id;
  const studentBranch = req.student.branch;
  const studentYear = req.student.year;

  const {
    subject_name,
    subject_code,
    subject_credit,
    teacher,
    question1_rating,
    question2_rating,
    question3_rating,
    question4_rating,
    question5_rating,
    question6_rating,
    question7_rating,
    question8_rating,
    question9_rating,
    question10_rating,
    comments,
  } = req.body;

  // Step 1: Check if feedback form is available for the subject
  const allocatedSubject = await AllocatedSubject.findOne({
    subject_name,
    subject_code,
    subject_credit,
    branch: studentBranch,
    year: studentYear,
    teacher,
  }).lean();

  if (!allocatedSubject || !allocatedSubject.feedbackReleased) {
    throw new ApiError(403, "Feedback form is not available for the subject.");
  }

  // Step 2: Check if the student has already submitted feedback for the subject
  const existingFeedback = await LectureFeedback.findOne({
    student: studentId,
    subject_name,
    subject_code,
    subject_credit,
    branch: studentBranch,
    year: studentYear,
    teacher,
  }).lean();

  if (existingFeedback) {
    throw new ApiError(403, "Feedback form already submitted for the subject.");
  }

  // Step 3: Create feedback form
  const feedback = await LectureFeedback.create({
    subject_name,
    subject_code,
    subject_credit,
    teacher,
    branch: studentBranch,
    year: studentYear,
    question1_rating,
    question2_rating,
    question3_rating,
    question4_rating,
    question5_rating,
    question6_rating,
    question7_rating,
    question8_rating,
    question9_rating,
    question10_rating,
    comment : comments,
    submitter: studentId,
    submissionTime: new Date(),
  });

  await feedback.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, feedback, "Feedback form submitted successfully.")
    );
});

const logoutStudent = asyncHandler(async (req, res) => {
  Student.findByIdAndUpdate(
    req.student._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset: {
        studentRefreshToken: 1, // this removes the field from the document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("studentAccessToken", options)
    .clearCookie("studentRefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export {
  loginStudent,
  logoutStudent,
  getStudentProfile,
  getFeedbackForms,
  fillFeedbackForm,
};
