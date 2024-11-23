import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Admin } from "../models/admins.models.js";
import { Teacher } from "../models/teachers.models.js";
import { LectureFeedback } from "../models/lectureFeedbacks.models.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";
import { ResearchPaper } from "../models/research-papers.models.js";
import { EventParticipation } from "../models/events-participated.models.js";
import { STTP } from "../models/sttp.models.js";
import { StudentGuided } from "../models/students-guided.models.js";
import { Project } from "../models/projects.models.js";
import { Seminar } from "../models/seminars.models.js";
import { SeminarFeedback } from "../models/feedback-seminars.models.js";
import { Lecture } from "../models/lectures.models.js";
import { ExpertLecture } from "../models/expert-lectures.models.js";
import { Student } from "../models/students.models.js";
import { StudySubject } from "../models/studySubjects.models.js";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const admin = await Admin.findById(userId);
    const adminAccessToken = admin.generateAccessToken();
    const adminRefreshToken = admin.generateRefreshToken();

    admin.refreshToken = adminRefreshToken;

    await admin.save({ validateBeforeSave: false }); // this is inbuilt in mongoDB to save the info, but there is one problem with this thing and that it will invoke the password field and to stop that we put an object and make it false the thing that we put in the object is validateBeforeSave

    return { adminRefreshToken, adminAccessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, designation, password } = req.body;

  if (
    [name, email, designation, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required");
  }

  const existedUser = await Admin.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User with email already exists");
  }

  console.log("request: ", req.file);

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "No avatar file found");
  }

  const admin = await Admin.create({
    name,
    email,
    designation,
    avatar: avatar.url,
    password,
  });

  const createAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  if (!createAdmin) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { adminAccessToken, adminRefreshToken } =
    await generateAccessAndRefreshToken(admin._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("adminAccessToken", adminAccessToken, options)
    .cookie("adminRefreshToken", adminRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: createAdmin, adminAccessToken, adminRefreshToken },
        "Admin successfully registered"
      )
    );
}); // worked on postman

const registerTeacher = asyncHandler(async (req, res) => {
  const { name, email, employee_code, designation, experience, qualification, department, password } = req.body;
  // console.log('req: ', req);

  if (
    [name, email, employee_code, designation, experience, qualification, department, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields is required");
  }

  const existedUser = await Teacher.findOne({
    $or: [{ employee_code }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User with email or employee code already exists");
  }

  // console.log("request: ", req.file);

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "No avatar file found");
  }

  const teacher = await Teacher.create({
    name,
    email,
    employee_code,
    designation,
    experience,
    qualification,
    department,
    avatar: avatar.url,
    password,
  });

  const createTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );

  if (!createTeacher) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          teacher: createTeacher,
        },
        "Teacher successfully registered"
      )
    );
}); // worked on postman

const getCurrentTeacher = asyncHandler(async (req, res) => {
  const {teacherId} = req.params;

  const teacherInfo = await Teacher.findById(teacherId)
    .select("name email employee_code experience qualification department avatar")
    .lean(); 

  if (!teacherInfo) {
    throw new ApiError(404, "Teacher not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, teacherInfo, "current user fetched successfully")
    );
}); //worked on postman

const updateTeacherAccountDetails = asyncHandler(async (req, res) => {
  const {teacherId} = req.params;
  const { name, department, email, employee_code, designation, experience, qualification } = req.body;

  if (!name || !department || !email || !employee_code || !designation || !experience || !qualification) {
    throw new ApiError(400, "All field are requires");
  }

  const existedUser = await Admin.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User with email already exists");
  }

  const teacher = await Teacher.findByIdAndUpdate(
    teacherId,
    {
      $set: {
        name,
        email,
        employee_code,
        designation,
        experience,
        qualification,
        department,
      },
    },
    { new: true } // this returns all the values after the fields are updated
  ).select("-password");

  console.log("teacher: ", teacher);

  return res
    .status(200)
    .json(
      new ApiResponse(200, teacher, "Account details updated successfully")
    );
}); //worked on postman

const updateTeacherAvatar = asyncHandler(async (req, res) => {
  const {teacherId} = req.params;
  console.log(req.file);
  console.log(req.file.path);
  const avatarLocalPath = req.file?.path; // we are taking the file from multer middleware, also here we are only taking one file as input and therefore we are using 'file', whereas if we wanted to take multiple file we would have written 'files' instead of 'file'

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const teacher = await Teacher.findByIdAndUpdate(
    teacherId,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, teacher, "avatar image updated successfully"));
}); //did not work on postman

const allotSubjectsToTeachers = asyncHandler(async (req, res)=>{
  const { subject_name, subject_code, subject_credit, branch, year, min_lectures, teacherId } = req.body;

    // Validate input fields
    if (!subject_name || !subject_code || !subject_credit || !branch || !year || !min_lectures || !teacherId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      throw new ApiError(400, "Teacher not found.");
    }

    // Check if the subject is already allocated to the teacher
    const existingAllocation = await AllocatedSubject.findOne({
      subject_code,
      branch,
      year,
      teacher: teacherId,
    });

    if (existingAllocation) {
      throw new ApiError(400, "This subject is already allocated to this teacher")
    }

    // Create a new allocated subject record
    const allocatedSubject = await AllocatedSubject.create({
      subject_name,
      subject_code,
      subject_credit,
      branch,
      year,
      min_lectures,
      teacher: teacherId,
    });

    return res.status(200).json(new ApiResponse(200, {allocatedSubject, teacher}, "Subject alloted"))
}); //worked on postman

const viewAllAllocatedSubjectsOfTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const allocatedSubjects = await AllocatedSubject.find({ teacher: teacherId })
    .select("subject_name subject_code subject_credit branch year")
    .lean();

  if (!allocatedSubjects || allocatedSubjects.length === 0) {
    throw new ApiError(404, "No subjects allocated to this teacher.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allocatedSubjects,
        "Allocated subjects fetched successfully."
      )
    );
}); //worked on postman

const editAllocatedSubjectOfTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId, subjectId } = req.params;
  const { subject_name, subject_code, subject_credit, min_lectures, branch, year } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(400, "Invalid subject ID format.");
  }

  if (!subject_name || !subject_code || !subject_credit || !branch || !year || !min_lectures || !teacherId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const updatedSubject = await AllocatedSubject.findByIdAndUpdate(
    subjectId,
    {
      $set: {
        subject_name,
        subject_code,
        subject_credit,
        branch,
        year,
        min_lectures,
      },
    },
    { new: true }
  );

  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSubject, "Subject updated successfully.")
    );
}); //worked on postman

const deleteAllocatedSubjectOfTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId, subjectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(400, "Invalid subject ID format.");
  }

  const deletedSubject = await AllocatedSubject.findByIdAndDelete(subjectId);

  if (!deletedSubject) {
    throw new ApiError(404, "Subject not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedSubject, "Subject deleted successfully.")
    );
}); //worked on postman

const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, roll_no, branch, year, password } = req.body;

  if (
    [name, email, roll_no, branch, year, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields is required");
  }

  const existedUser = await Student.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User with email already exists");
  }
  console.log("request(student): ", req.file);

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "No avatar file found");
  }

  const student = await Student.create({
    name,
    email,
    roll_no,
    branch,
    year,
    avatar: avatar.url,
    password,
  });

  const createStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createStudent) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { student: createStudent },
        "Student successfully registered"
      )
    );
}); //worked on postman

const getCurrentStudent = asyncHandler(async (req, res) => {
  const {studentId} = req.params;

  const students = await Student.findById(studentId);

  if (!students) {
    throw new ApiError(404, "Student not found");
  }

  const studentInfo = students.select("name email roll_no branch year avatar").lean();

  return res
    .status(200)
    .json(
      new ApiResponse(200, studentInfo, "current user fetched successfully")
    );
}); //worked on postman

const updateStudentAccountDetails = asyncHandler(async (req, res) => {
  const {studentId} = req.params;
  const { name, email, roll_no, branch, year } = req.body;

  if (!name || !roll_no || !email || !branch || !year) {
    throw new ApiError(400, "All field are requires");
  }

  const student = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        name,
        roll_no,
        email,
        branch,
        year,
      },
    },
    { new: true } // this returns all the values after the fields are updated
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "Account details updated successfully")
    );
}); //worked on postman

//todo: delete the previous avatar image from the db and cloudinary
const updateStudentAvatar = asyncHandler(async (req, res) => {
  const {studentId} = req.params;
  const avatarLocalPath = req.file?.path; // we are taking the file from multer middleware, also here we are only taking one file as input and therefore we are using 'file', whereas if we wanted to take multiple file we would have written 'files' instead of 'file'

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const student = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, student, "avatar image updated successfully"));
});

const allottSubjectsToStudents = asyncHandler(async (req, res) => {
  const { subject_name, subject_code, subject_credit, teacherId, studentId } = req.body;

  // Validate inputs
  if (!subject_name || !subject_code || !subject_credit || !teacherId || !studentId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if the teacher exists
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    return res.status(404).json({ error: "Teacher not found." });
  }

  // Check if the student exists
  const student = await Student.findById(studentId);

  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }

  // Check if the subject is already allotted to the student
  const existingAllocation = await StudySubject.findOne({
    subject_name,
    subject_code,
    student: studentId,
  });

  if (existingAllocation) {
    return res
      .status(400)
      .json({ error: "Subject is already allotted to this student." });
  }

  // Create and save the subject allocation
  const studySubject = await StudySubject.create({
    subject_name,
    subject_code,
    subject_credit,
    teacher: teacherId,
    student: studentId,
  });
  
  return res.status(200).json(new ApiResponse(200, { studySubject, teacher, student }, "Subject allotted to student successfully."));
}); //worked on postman

const viewAllSubjectsAllottedToTheStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID format.");
  }

  const studySubjects = await StudySubject.find({ student: studentId })
    .select("subject_name subject_code subject_credit teacher")
    .populate("teacher", "name department")
    .lean();

  if (!studySubjects || studySubjects.length === 0) {
    throw new ApiError(404, "No subjects allotted to this student.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        studySubjects,
        "Subjects allotted to student fetched successfully."
      )
    );
}); //worked on postman

const editAllottedSubjectOfTheStudent = asyncHandler(async (req, res) => {
  const { studentId, subjectId } = req.params;
  const { subject_name, subject_code, subject_credit, teacherId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID format.");
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(400, "Invalid subject ID format.");
  }

  const updatedSubject = await StudySubject.findByIdAndUpdate(
    subjectId,
    {
      $set: {
        subject_name,
        subject_code,
        subject_credit,
        teacher: teacherId,
      },
    },
    { new: true }
  );

  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSubject, "Subject updated successfully.")
    );
}); //worked on postman

const deleteAllottedSubjectOfTheStudent = asyncHandler(async (req, res) => {
  const { studentId, subjectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID format.");
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(400, "Invalid subject ID format.");
  }

  const deletedSubject = await StudySubject.findByIdAndDelete(subjectId);

  if (!deletedSubject) {
    throw new ApiError(404, "Subject not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedSubject, "Subject deleted successfully.")
    );
}); //worked on postman

const releaseFeedbackForms = asyncHandler(async (req, res)=>{

})

const loginAdmin = asyncHandler(async (req, res) => {
  console.log("request : ", req);
  console.log("request's body : ", req.body);
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await Admin.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { adminAccessToken, adminRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await Admin.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("adminAccessToken", adminAccessToken, options)
    .cookie("adminRefreshToken", adminRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          adminAccessToken,
          adminRefreshToken,
        },
        "User Logged In Successfully"
      )
    );
}); // worked on postman

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset: {
        adminRefreshToken: 1, // this removes the field from the document
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
    .clearCookie("adminAccessToken", options)
    .clearCookie("adminRefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
}); // worked on postman

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.admin, "current user fetched successfully"));
}); // worked on postman

const updateAccountDetails = asyncHandler(async (req, res) => {
  console.log("req.body of update account details: ", req.body);
  const { name, designation, email, password } = req.body;

  if (!name || !designation || !email || !password) {
    throw new ApiError(400, "All field are requires");
  }

  const admin = await Admin.findByIdAndUpdate(
    req.admin?._id,
    {
      $set: {
        name,
        designation,
        email,
        password,
      },
    },
    { new: true } // this returns all the values after the fields are updated
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Account details updated successfully"));
}); // worked on postman

const updateAdminAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; // we are taking the file from multer middleware, also here we are only taking one file as input and therefore we are using 'file', whereas if we wanted to take multiple file we would have written 'files' instead of 'file'

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const admin = await Admin.findByIdAndUpdate(
    req.admin?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "avatar image updated successfully"));
});

const getAllTheBranches = asyncHandler(async (req, res) => {
  const branches = await Student.distinct("branch");

  return res
    .status(200)
    .json(new ApiResponse(200, branches, "All branches fetched successfully"));
});

const getAllTheStudentsOfParticularBranch = asyncHandler(async (req, res) => {
  const { branch } = req.params;

  const students = await Student.find({ branch });

  return res
    .status(200)
    .json(
      new ApiResponse(200, students, "All students of the branch fetched successfully")
    );
});

const getAllTheTeachers = asyncHandler(async (req, res) => {
  // Extract query parameters for searching, pagination, and sorting
  const {
    name,
    email,
    department,
    employee_code,
    page = 1,
    limit = 10,
    sortBy = "name",
    order = "asc",
  } = req.query;

  // Build the search filter object
  let filter = {};

  if (name) {
    // Case-insensitive partial match for name
    filter.name = { $regex: name, $options: "i" };
  }

  if (email) {
    // Case-insensitive partial match for email
    filter.email = { $regex: email, $options: "i" };
  }

  if (department) {
    // Case-insensitive partial match for department
    filter.department = { $regex: department, $options: "i" };
  }

  if (employee_code) {
    // Case-insensitive partial match for employee_code
    filter.employee_code = { $regex: employee_code, $options: "i" };
  }

  // Determine sort order
  const sortOrder = order === "desc" ? -1 : 1;

  // Execute the query with search, pagination, and sorting
  const teachers = await Teacher.find(filter)
    .select("-password -refreshToken") // Exclude sensitive fields
    .sort({ [sortBy]: sortOrder }) // Sort based on query params
    .limit(parseInt(limit)) // Limit number of results
    .skip((parseInt(page) - 1) * parseInt(limit)) // Skip for pagination
    .exec();

  // Get total count for pagination
  const total = await Teacher.countDocuments(filter);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Prepare the response data
  const responseData = {
    teachers,
    pagination: {
      total,
      totalPages,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
    },
  };

  // Return the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "All teachers fetched successfully")
    );
});

const getTeacherPersonalInfo = asyncHandler(async (req, res) => {
  // Step 1: Extract teacherId from request parameters
  const { teacherId } = req.params;

  // Validate teacherId as a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  // Step 2: Fetch teacher's personal information
  const teacher = await Teacher.findById(teacherId)
    .select("avatar name department employee_code email")
    .lean(); // Use lean() for plain JavaScript objects

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  // Step 3: Fetch subjects taught by the teacher
  const subjects = await AllocatedSubject.find({ owner: teacherId })
    .select("subject_name subject_code subject_credit branch year")
    .lean();

  // Include the AllocatedSubject's _id for feedback retrieval
  const subjectsWithId = subjects.map((subject) => ({
    _id: subject._id,
    subject_name: subject.subject_name,
    subject_code: subject.subject_code,
    subject_credit: subject.subject_credit,
    branch: subject.branch,
    year: subject.year,
  }));

  // Step 4: Construct the response data
  const responseData = {
    teacher: {
      avatar: teacher.avatar,
      name: teacher.name,
      department: teacher.department,
      employee_code: teacher.employee_code,
      email: teacher.email,
    },
    subjects: subjectsWithId,
  };

  // Step 5: Send the response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        "Teacher personal info fetched successfully."
      )
    );
});

/**
 * Controller to fetch feedbacks for a specific subject taught by a teacher.
 * Accessible only by authenticated admins.
 */
const getSubjectFeedbacks = asyncHandler(async (req, res) => {
  // Step 1: Extract teacherId and subjectId from request parameters
  const { teacherId, subjectId } = req.params;

  // Validate teacherId and subjectId as valid MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(400, "Invalid subject ID format.");
  }

  // Step 2: Verify the subject belongs to the teacher
  const subject = await AllocatedSubject.findOne({
    _id: subjectId,
    owner: teacherId,
  }).lean();

  if (!subject) {
    throw new ApiError(404, "Subject not found for this teacher.");
  }

  // Step 3: Fetch feedbacks matching subject details
  const feedbacks = await LectureFeedback.find({
    subject_name: subject.subject_name,
    subject_code: subject.subject_code,
    subject_credit: subject.subject_credit,
    branch: subject.branch,
    year: subject.year,
  })
    .populate("owner", "name branch year") // Include student details
    .select("rating comment owner") // Select required fields
    .lean();

  if (!feedbacks || feedbacks.length === 0) {
    throw new ApiError(404, "No feedback found for this subject.");
  }

  // Step 4: Construct response data
  const feedbackList = feedbacks.map((feedback) => ({
    rating: feedback.rating,
    comment: feedback.comment,
  }));

  // Step 5: Send the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, feedbackList, "Feedbacks fetched successfully.")
    );
});

const getResearchPapersPublishedByTheTeacher = asyncHandler(
  async (req, res) => {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      throw new ApiError(400, "Invalid teacher ID format.");
    }

    const researchPapers = await ResearchPaper.find({ owner: teacherId })
      .select("name publication publishedDate viewUrl")
      .lean();

    if (!researchPapers || researchPapers.length === 0) {
      throw new ApiError(404, "No research papers found for this teacher.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          researchPapers,
          "Research papers fetched successfully."
        )
      );
  }
);

const getEventsParticipatedByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const eventsParticipated = await EventParticipation.find({ owner: teacherId })
    .select("role event date report")
    .lean();

  if (!eventsParticipated || eventsParticipated.length === 0) {
    throw new ApiError(404, "No events participated found for this teacher.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        eventsParticipated,
        "Events participated fetched successfully."
      )
    );
});

const getExpertLecturesDeliveredByTheTeacher = asyncHandler(
  async (req, res) => {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      throw new ApiError(400, "Invalid teacher ID format.");
    }

    const expertLectures = await ExpertLecture.find({ owner: teacherId })
      .select("topic duration date report")
      .lean();

    if (!expertLectures || expertLectures.length === 0) {
      throw new ApiError(
        404,
        "No expert lectures delivered found for this teacher."
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          expertLectures,
          "Expert lectures delivered fetched successfully."
        )
      );
  }
);

const getSTTPConductedByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const sttps = await STTP.find({ owner: teacherId })
    .select("topic duration startDate endDate venue report")
    .lean();

  if (!sttps || sttps.length === 0) {
    throw new ApiError(404, "No STTPs conducted found for this teacher.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sttps, "STTPs conducted fetched successfully."));
});

const getMtechStudentsGuidedByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const mtechStudentsGuided = await StudentGuided.find({
    owner: teacherId,
    mOp: "MTech",
  })
    .select(
      "topic student_name roll_no branch academic_year mOp createdAt addedOn"
    )
    .lean();

  if (!mtechStudentsGuided || mtechStudentsGuided.length === 0) {
    throw new ApiError(
      404,
      "No M.Tech students guided found for this teacher."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        mtechStudentsGuided,
        "M.Tech students guided fetched successfully."
      )
    );
});

const getPhdStudentsGuidedByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const phdStudentsGuided = await StudentGuided.find({
    owner: teacherId,
    mOp: "Phd",
  })
    .select("topic student_name roll_no branch academic_year")
    .lean();

  if (!phdStudentsGuided || phdStudentsGuided.length === 0) {
    throw new ApiError(404, "No Ph.D students guided found for this teacher.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        phdStudentsGuided,
        "Ph.D students guided fetched successfully."
      )
    );
});

const getProjectsHeldByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const projects = await Project.find({ owner: teacherId })
    .select("topic branch_name daily_duration startDate endDate report")
    .lean();

  if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects held found for this teacher.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, projects, "Projects held fetched successfully.")
    );
});

const getSeminarsConductedByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const seminars = await Seminar.find({ owner: teacherId, status: "conducted" })
    .select("topic duration date report")
    .lean();

  if (!seminars || seminars.length === 0) {
    throw new ApiError(404, "No seminars conducted found for this teacher.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, seminars, "Seminars conducted fetched successfully.")
    );
});

const getUpcomingSeminarByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const seminars = await Seminar.find({ owner: teacherId, status: "upcoming" })
    .select("topic department duration date")
    .lean();

  if (!seminars || seminars.length === 0) {
    throw new ApiError(404, "No upcoming seminars found for this teacher.");
  }

  // Fetch the RSVP count for each seminar
  const seminarDetailsWithRSVP = await Promise.all(
    seminars.map(async (seminar) => {
      const rsvpCount = await SeminarRSVP.countDocuments({
        seminar: seminar._id,
      });
      return {
        ...seminar,
        rsvpCount,
      };
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        seminarDetailsWithRSVP,
        "Upcoming seminars fetched successfully with RSVP count."
      )
    );
});

const getConductedSeminarFeedbacks = asyncHandler(async (req, res) => {
  const { teacherId, seminarId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  if (!mongoose.Types.ObjectId.isValid(seminarId)) {
    throw new ApiError(400, "Invalid seminar ID format.");
  }

  const feedbacks = await SeminarFeedback.findById({ seminar: seminarId })
    .select("rating comment")
    .lean();

  if (!feedbacks || feedbacks.length === 0) {
    throw new ApiError(404, "No feedbacks found for this seminar.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Feedbacks fetched successfully."));
});

const getLecturesConductedByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const lectures = await Lecture.find({ owner: teacherId })
    .select("topic duration date")
    .lean();

  if (!lectures || lectures.length === 0) {
    throw new ApiError(404, "No lectures conducted found for this teacher.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, lectures, "Lectures conducted fetched successfully.")
    );
});

export {
  registerAdmin,
  registerTeacher,
  getCurrentTeacher,
  updateTeacherAccountDetails,
  updateTeacherAvatar,
  allotSubjectsToTeachers,
  viewAllAllocatedSubjectsOfTheTeacher,
  editAllocatedSubjectOfTheTeacher,
  deleteAllocatedSubjectOfTheTeacher,
  registerStudent,
  getCurrentStudent,
  updateStudentAccountDetails,
  updateStudentAvatar,
  allottSubjectsToStudents,
  viewAllSubjectsAllottedToTheStudent,
  editAllottedSubjectOfTheStudent,
  deleteAllottedSubjectOfTheStudent,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  updateAdminAvatar,
  updateAccountDetails,
  getAllTheBranches,
  getAllTheStudentsOfParticularBranch,
  getAllTheTeachers,
  getTeacherPersonalInfo,
  getSubjectFeedbacks,
  getResearchPapersPublishedByTheTeacher,
  getEventsParticipatedByTheTeacher,
  getExpertLecturesDeliveredByTheTeacher,
  getSTTPConductedByTheTeacher,
  getMtechStudentsGuidedByTheTeacher,
  getPhdStudentsGuidedByTheTeacher,
  getProjectsHeldByTheTeacher,
  getSeminarsConductedByTheTeacher,
  getUpcomingSeminarByTheTeacher,
  getConductedSeminarFeedbacks,
  getLecturesConductedByTheTeacher,
};
