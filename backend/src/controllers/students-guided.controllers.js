import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { StudentGuided } from "../models/students-guided.models.js";

// all routes done.

const uploadStudentInfo = asyncHandler(async (req, res) => {
  const { topic, student_name, roll_no, branch, mOp, academic_year } = req.body;
  
  
  if (
    [topic, student_name, branch, mOp, academic_year].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    roll_no == null ||
    roll_no === ""
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingStudent = await StudentGuided.findOne({ roll_no, topic });
  if (existingStudent) {
    throw new ApiError(409, "Student with the same roll number and topic already exists");
  }


  const newStudent = await StudentGuided.create({
    topic,
    student_name,
    roll_no,
    branch,
    mOp,
    academic_year,
    addedOn: Date.now() ,
    owner: req.teacher._id,
  });

  // console.log("hellow2");
  

  return res
    .status(200)
    .json(new ApiResponse(201, newStudent, "New Student Added"));
});

const showAllMtechStudent = asyncHandler(async (req, res) => {
  const mtechStudents = await StudentGuided.find({
    owner: req.teacher._id,
    mOp: "Mtech",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, mtechStudents, "Mtech students fetched"));
});

const showAllPhdStudent = asyncHandler(async (req, res) => {
  const phdStudents = await StudentGuided.find({
    owner: req.teacher._id,
    mOp: "PhD",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, phdStudents, "Mtech students fetched"));
});

// in the params id is of the studen.
const editStudentInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { topic, student_name, roll_no, branch, mOp, academic_year } = req.body;

  const studentInfo = await StudentGuided.findById(id);

  if (!studentInfo) {
    throw new ApiError(404, "No such student found");
  }

  if (studentInfo.owner.toString() !== req.teacher._id.toString()) {
    throw new ApiError(
      403,
      "You are not the authorized to update this research paper"
    );
  }

  if (topic) studentInfo.topic = topic;
  if (student_name) studentInfo.student_name = student_name;
  if (roll_no) studentInfo.roll_no = roll_no;
  if (branch) studentInfo.branch = branch;
  if (mOp) studentInfo.mOp = mOp;
  if (academic_year) studentInfo.academic_year = academic_year;

  const savedInfo = await studentInfo.save();

  return res
    .status(201)
    .json(new ApiResponse(201, savedInfo, "Student's info updated"));
});

const deleteStudentInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await StudentGuided.findById(id);

  if (!student) {
    throw new ApiError(404, "No such student found");
  }

  await StudentGuided.deleteOne({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Student removed successfully"));
});

export {
  uploadStudentInfo,
  showAllMtechStudent,
  showAllPhdStudent,
  editStudentInfo,
  deleteStudentInfo,
};
