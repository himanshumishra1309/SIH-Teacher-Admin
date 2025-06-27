import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";
import { Student } from "../models/students.models.js";
import { Lecture } from "../models/lectures.models.js";
import { Attendance } from "../models/lectureAttendance.models.js";
import mongoose from "mongoose";
import { StudySubject } from "../models/studySubjects.models.js";

const addNewLecture = asyncHandler(async (req, res) => {
  const { subjectId, teacherId } = req.params;
  const { topic, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(404, "Teacher Not Found");
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(404, "Subject Not Found");
  }

  if (!topic || !date) {
    throw new ApiError(400, "All fields are required");
  }

  const lecture = await Lecture.create({
    subject: subjectId,
    topic,
    duration: 2,
    date,
    owner: teacherId,
  });

  if (!lecture) {
    throw new ApiError(500, "Unable to create a new lecture");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "New Lecture Created Successfully"));
});

const editLecture = asyncHandler(async (req, res) => {
  const { lecturId, teacherId } = req.params;
  const { topic, duration, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(404, "Teacher Not Found");
  }

  if (!mongoose.Types.ObjectId.isValid(lecturId)) {
    throw new ApiError(404, "Subject Not Found");
  }

  if (!topic || !duration || !date) {
    throw new ApiError(400, "All fields are required");
  }

  const editedLecture = await Lecture.findByIdAndUpdate(
    lecturId,
    {
      $set: {
        topic,
        duration,
        date,
      },
    },
    { new: true }
  );

  if (!editedLecture) {
    throw new ApiError(500, "Couldn't Edit lecture");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, editedLecture, "Lecture Edited Successfully"));
});

const deleteLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(lectureId)) {
    throw new ApiError(404, "Lecture Not Found");
  }

  const deletedLecture = await Lecture.findByIdAndDelete(lectureId);

  if (!deletedLecture) {
    throw new ApiError(500, "Couldn't delete the lecture");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedLecture, "Lecture Deleted Successfully"));
});

const getLectureById = asyncHandler(async (req, res) => {
  const { subjectId, teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(404, "Lecture Not Found");
  }

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(404, "Lecture Not Found");
  }

  const lecture = await Lecture.find({
    subject: subjectId,
    owner: teacherId,
  });

  if (!lecture) {
    throw new ApiError(404, "Lecture Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture Found Successfully"));
});

const fetchAllStudents = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(404, "Subject Not Found");
  }

  const subjectInfo = await AllocatedSubject.findById(subjectId).select(
    "subject_name subject_code subject_credit type branch year"
  );

  if (!subjectInfo) {
    throw new ApiError(404, "Subject Not Found");
  }

  const students = await StudySubject.aggregate([
    {
      $match: {
        subject_name: subjectInfo.subject_name,
        subject_code: subjectInfo.subject_code,
        subject_credit: subjectInfo.subject_credit,
        subject_type: subjectInfo.type,
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $match: {
        "student.branch": subjectInfo.branch, // Match branch within the student object
        "student.year": subjectInfo.year, // Match year within the student object
      },
    },
    {
      $project: {
        _id: "$student._id",
        name: "$student.name",
        roll_no: "$student.roll_no",
        branch: "$student.branch",
        year: "$student.year",
      },
    },
  ]);

  if (!students) {
    throw new ApiError(404, "No Students Found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { students, subjectInfo },
        "Students Found Successfully"
      )
    );
});

const getStudentsByBranch = asyncHandler(async (req, res) => {
  const { branchName } = req.params;

  if (!branchName?.trim()) {
    throw new ApiError(400, "Branch name is required");
  }

  // Fetch students matching the branch name
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

const markLectureAttendance = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const teacher = req.teacher._id;
  const {
    studentIds,
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
    date,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(lectureId)) {
    throw new ApiError(404, "Invalid Lecture ID");
  }

  if (!studentIds || studentIds.length === 0) {
    throw new ApiError(400, "Student IDs are required");
  }

  console.log({ studentIds });

  // (Optional) Verify if the students belong to the correct branch and year (based on your backend logic).
  const validStudents = await Student.find({
    _id: { $in: studentIds },
    branch,
    year,
  }).select("_id");

  console.log({ validStudents });

  const validStudentIds = validStudents.map((s) => s._id.toString());
  console.log({ validStudentIds });
  const invalidIds = studentIds.filter((id) => !validStudentIds.includes(id));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid student IDs: ${invalidIds.join(", ")}`);
  }

  const existingAttendance = await Attendance.findOne({
    lecture: lectureId,
    date: {
      $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
    },
  });

  if (existingAttendance) {
    throw new ApiError(
      400,
      "Attendance already marked for this lecture on the specified date"
    );
  }

  const attendance = await Attendance.create({
    subject_name,
    subject_code, // new
    subject_credit,
    teacher,
    branch,
    year,
    date: date || new Date(),
    lecture: lectureId,
    studentsPresent: studentIds,
  });

  if (!attendance) {
    throw new ApiError(500, "Couldn't mark the attendance");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { attendance, markedStudents: validStudentIds.length },
        "Attendance Marked Successfully"
      )
    );
});

const viewAttendanceOfALecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(lectureId)) {
    throw new ApiError(404, "Invalid Lecture ID");
  }

  const attendance = await Attendance.findOne({ lecture: lectureId }).populate({
    path: "studentsPresent",
    select: "name roll_no email",
  });

  if (!attendance) {
    throw new ApiError(404, "Attendance not found for this lecture");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, attendance, "Attendance found successfully"));
});

export {
  addNewLecture,
  editLecture,
  deleteLecture,
  getLectureById,
  fetchAllStudents,
  markLectureAttendance,
  getStudentsByBranch,
  viewAttendanceOfALecture,
};
