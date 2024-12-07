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
  const { topic, duration, date } = req.body;

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
    duration : 2,
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
    select: "name rollNumber email", // Specify the fields you want from the Student model
  });

  if (!attendance) {
    throw new ApiError(404, "Attendance not found for this lecture");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, attendance, "Attendance found successfully"));
});

const completeLecturePoints = asyncHandler(async (req, res) => {
  const lectureDomain = [
    "1-Theory",
    "2-Theory",
    "3-Theory",
    "4-Theory",
    "1-Practical",
    "2-Practical",
    "3-Practical",
    "4-Practical",
  ];

  const teacherId = req.teacher._id; // Expect teacherId from params

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total lecture points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: lectureDomain }, // Filter by lecture domain
    },
    {
      $group: {
        _id: "$owner", // Group by teacher (owner)
        totalPoints: { $sum: "$points" }, // Calculate total points
      },
    },
    {
      $lookup: {
        from: "teachers", // Ensure this matches your Teacher collection name
        localField: "_id", // Match owner ID
        foreignField: "_id", // Match Teacher ID
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher", // Flatten the teacher data
    },
    {
      $sort: { totalPoints: -1 }, // Sort by total points (descending)
    },
  ]);

  if (aggregatedPoints.length === 0) {
    throw new ApiError(404, "No lecture points found");
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId.toString()
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId.toString()
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  if (
    !requestedTeacherRank ||
    !requestedTeacherPoints ||
    !requestedTeacherName
  ) {
    throw new ApiError(404, "Teacher's data not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        highestPoints,
        teacherWithHighestPoints,
        teachers: aggregatedPoints.map((entry, index) => ({
          rank: index + 1,
          teacherName: entry.teacher.name,
          totalPoints: entry.totalPoints,
        })),
        requestedTeacherRank,
        requestedTeacherName,
        requestedTeacherPoints,
      },

      "Lecture points calculated successfully"
    )
  );
});

const completeContributionPoints = asyncHandler(async (req, res) => {
  const contributionDomains = [
    "Industrial Visit",
    "Workshop Conducted",
    "Extra Course Studied",
    "Made Study Materials",
    "Miscellaneous",
  ];

  const teacherId = req.teacher._id;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total contribution points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: contributionDomains } }, // Filter by contribution domains
    },
    {
      $group: {
        _id: "$owner", // Group by teacher (owner)
        totalPoints: { $sum: "$points" }, // Calculate total points
      },
    },
    {
      $lookup: {
        from: "teachers", // Ensure this matches your Teacher collection name
        localField: "_id", // Match owner ID
        foreignField: "_id", // Match Teacher ID
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher", // Flatten the teacher data
    },
    {
      $sort: { totalPoints: -1 }, // Sort by total points (descending)
    },
  ]);

  if (aggregatedPoints.length === 0) {
    throw new ApiError(404, "No contribution points found");
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId.toString()
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId.toString()
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual contribution points for the requested teacher
  const contributionPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
        domain: { $in: contributionDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by contribution type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const contributionPoints = contributionDomains.reduce((acc, domain) => {
    const entry = contributionPointsBreakdown.find(
      (item) => item._id === domain
    );
    acc[domain] = entry ? entry.totalPoints : 0;
    return acc;
  }, {});

  // Prepare the response
  const response = {
    highestPoints,
    teacherWithHighestPoints,
    teachers: aggregatedPoints.map((entry, index) => ({
      rank: index + 1,
      teacherName: entry.teacher.name,
      totalPoints: entry.totalPoints,
    })),
    requestedTeacherRank,
    requestedTeacherName,
    requestedTeacherPoints,
    contributionPoints, // Include contribution-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Contribution points calculated successfully"
      )
    );
});

const completeStudentGuidedPoints = asyncHandler(async (req, res) => {
  const studentGuidedDomains = ["PhD", "Mtech"];

  const { teacherId } = req.params;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total student guided points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: studentGuidedDomains } }, // Filter by student guided domains
    },
    {
      $group: {
        _id: "$owner", // Group by teacher (owner)
        totalPoints: { $sum: "$points" }, // Calculate total points
      },
    },
    {
      $lookup: {
        from: "teachers", // Ensure this matches your Teacher collection name
        localField: "_id", // Match owner ID
        foreignField: "_id", // Match Teacher ID
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher", // Flatten the teacher data
    },
    {
      $sort: { totalPoints: -1 }, // Sort by total points (descending)
    },
  ]);

  if (aggregatedPoints.length === 0) {
    throw new ApiError(404, "No student guided points found");
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId.toString()
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId.toString()
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual student guided points for the requested teacher
  const studentGuidedPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
        domain: { $in: studentGuidedDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by student guided type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const studentGuidedPoints = studentGuidedDomains.reduce((acc, domain) => {
    const entry = studentGuidedPointsBreakdown.find(
      (item) => item._id === domain
    );
    acc[domain] = entry ? entry.totalPoints : 0;
    return acc;
  }, {});

  // Prepare the response
  const response = {
    highestPoints,
    teacherWithHighestPoints,
    teachers: aggregatedPoints.map((entry, index) => ({
      rank: index + 1,
      teacherName: entry.teacher.name,
      totalPoints: entry.totalPoints,
    })),
    requestedTeacherRank,
    requestedTeacherName,
    requestedTeacherPoints,
    studentGuidedPoints, // Include student guided-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Student guided points calculated successfully"
      )
    );
});

const getComparativePointsData = asyncHandler(async (req, res) => {
  // const { teacherId } = req.params;
  const teacherId = req.teacher._id;
  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  const categoryMapping = {
    Journal: ["International Journal", "National Journal", "Regional Journal"],
    Book: ["International Book", "National Book", "Regional Book"],
    Chapter: ["International Chapter", "National Chapter", "Regional Chapter"],
    Conference: [
      "International Conference",
      "National Conference",
      "Regional Conference",
    ],
    Patent: ["International Patent", "National Patent", "Regional Patent"],
    Project: ["Major Projects", "Minor Projects"],
    STTP: [
      "STTP_1_DAY",
      "STTP_2_3_DAYS",
      "STTP_4_5_DAYS",
      "STTP_1_WEEK",
      "STTP_2_WEEKS",
      "STTP_3_WEEKS",
      "STTP_4_WEEKS",
    ],
    Event: [
      "Organizer National Event",
      "Organizer International Event",
      "Organizer State Event",
      "Organizer College Event",
      "Speaker National Event",
      "Speaker International Event",
      "Speaker State Event",
      "Speaker College Event",
      "Judge National Event",
      "Judge International Event",
      "Judge State Event",
      "Judge College Event",
      "Coordinator National Event",
      "Coordinator International Event",
      "Coordinator State Event",
      "Coordinator College Event",
      "Volunteer National Event",
      "Volunteer International Event",
      "Volunteer State Event",
      "Volunteer College Event",
      "Evaluator National Event",
      "Evaluator International Event",
      "Evaluator State Event",
      "Evaluator College Event",
      "Panelist National Event",
      "Panelist International Event",
      "Panelist State Event",
      "Panelist College Event",
      "Mentor National Event",
      "Mentor International Event",
      "Mentor State Event",
      "Mentor College Event",
      "Session Chair National Event",
      "Session Chair International Event",
      "Session Chair State Event",
      "Session Chair College Event",
      "Reviewer National Event",
      "Reviewer International Event",
      "Reviewer State Event",
      "Reviewer College Event",
    ],
    Seminar: [
      "National Seminar",
      "International Seminar",
      "State Seminar",
      "College Seminar",
    ],
    "Expert Lecture": [
      "National Expert Lecture",
      "International Expert Lecture",
      "State Expert Lecture",
      "College Expert Lecture",
    ],
    "Seminar Conducted": ["Seminar"],
  };

  const allDomains = Object.values(categoryMapping).flat();

  const comparativeData = await Point.aggregate([
    {
      $match: { domain: { $in: allDomains } },
    },
    {
      $group: {
        _id: {
          category: {
            $switch: {
              branches: Object.entries(categoryMapping).map(
                ([category, domains]) => ({
                  case: { $in: ["$domain", domains] },
                  then: category,
                })
              ),
              default: "Other",
            },
          },
          owner: "$owner",
        },
        totalPoints: { $sum: "$points" },
      },
    },
    {
      $group: {
        _id: "$_id.category",
        highestPoints: { $max: "$totalPoints" },
        teacherPoints: {
          $sum: {
            $cond: [
              { $eq: ["$_id.owner", new mongoose.Types.ObjectId(teacherId)] },
              "$totalPoints",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        category: "$_id",
        highestPoints: 1,
        teacherPoints: 1,
        _id: 0,
      },
    },
    {
      $sort: { category: 1 },
    },
  ]);

  // Prepare data for Chart.js
  const chartData = {
    labels: comparativeData.map((item) => item.category),
    datasets: [
      {
        label: "Highest Points",
        data: comparativeData.map((item) => item.highestPoints),
      },
      {
        label: "Teacher Points",
        data: comparativeData.map((item) => item.teacherPoints),
      },
    ],
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comparativeData, chartData },
        "Comparative points data retrieved successfully"
      )
    );
});

const calculateTeacherRanks = asyncHandler(async (req, res) => {
  // Define the domains for each category
  const academicDomains = [
    "International Journal",
    "National Journal",
    "Regional Journal",
    "International Chapter",
    "National Chapter",
    "Regional Chapter",
    "International Book",
    "National Book",
    "Regional Book",
    "International Conference",
    "National Conference",
    "Regional Conference",
    "International Seminar Attended",
    "National Seminar Attended",
    "State Seminar Attended",
    "Organizer National Event",
    "Organizer International Event",
    "Organizer State Event",
    "Organizer College Event",
    "Speaker National Event",
    "Speaker International Event",
    "Speaker State Event",
    "Speaker College Event",
    "Judge National Event",
    "Judge International Event",
    "Judge State Event",
    "Judge College Event",
    "Coordinator National Event",
    "Coordinator International Event",
    "Coordinator State Event",
    "Coordinator College Event",
    "Volunteer National Event",
    "Volunteer International Event",
    "Volunteer State Event",
    "Volunteer College Event",
    "Evaluator National Event",
    "Evaluator International Event",
    "Evaluator State Event",
    "Evaluator College Event",
    "Panelist National Event",
    "Panelist International Event",
    "Panelist State Event",
    "Panelist College Event",
    "Mentor National Event",
    "Mentor International Event",
    "Mentor State Event",
    "Mentor College Event",
    "Session Chair National Event",
    "Session Chair International Event",
    "Session Chair State Event",
    "Session Chair College Event",
    "Reviewer National Event",
    "Reviewer International Event",
    "Reviewer State Event",
    "Reviewer College Event",
    "Mtech Students Guided",
    "PhD Students Guided",
    "STTP_1_DAY",
    "STTP_2_3_DAYS",
    "STTP_4_5_DAYS",
    "STTP_1_WEEK",
    "STTP_2_WEEKS",
    "STTP_3_WEEKS",
    "STTP_4_WEEKS",
    "Major Projects",
    "Minor Projects",
    "Ongoing Funded Above ₹10 Lakh Research",
    "Ongoing Funded Below ₹10 Lakh Research",
    "Completed Funded Above ₹10 Lakh Research",
    "Completed Funded Below ₹10 Lakh Research",
  ];

  const feedbackDomains = [
    "1-Theory",
    "2-Theory",
    "3-Theory",
    "4-Theory",
    "1-Practical",
    "2-Practical",
    "3-Practical",
    "4-Practical",
    "Seminar",
  ];

  const otherDomains = [
    "Industrial-Visit-Other",
    "Task-Points-Other",
    "Industrial-Visit-Other",
    "Wookshop-Conducted-Other",
    "Extra-Course-Studied-Other",
    "Made-Study-Materials-Other",
    "Miscellaneous",
    "Task-Points-Other",
  ];

  // Aggregate points for all teachers
  const teacherPoints = await Point.aggregate([
    {
      $group: {
        _id: "$owner",
        academicPoints: {
          $sum: {
            $cond: [{ $in: ["$domain", academicDomains] }, "$points", 0],
          },
        },
        feedbackPoints: {
          $sum: {
            $cond: [{ $in: ["$domain", feedbackDomains] }, "$points", 0],
          },
        },
        otherPoints: {
          $sum: {
            $cond: [{ $in: ["$domain", otherDomains] }, "$points", 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "teachers",
        localField: "_id",
        foreignField: "_id",
        as: "teacherInfo",
      },
    },
    {
      $unwind: "$teacherInfo",
    },
  ]);

  console.log({ teacherPoints });

  // Calculate max points
  const maxPoints = teacherPoints.reduce(
    (max, teacher) => ({
      academicPoints: Math.max(max.academicPoints, teacher.academicPoints),
      feedbackPoints: Math.max(max.feedbackPoints, teacher.feedbackPoints),
      otherPoints: Math.max(max.otherPoints, teacher.otherPoints),
    }),
    { academicPoints: 0, feedbackPoints: 0, otherPoints: 0 }
  );

  console.log({ maxPoints });

  // Calculate total points and performance category for each teacher
  const rankedTeachers = teacherPoints.map((teacher) => {
    // Initialize totalPoints and weight sum
    let totalPoints = 0;
    let weightSum = 0;

    // Add academicPoints if maxPoints.academicPoints is greater than 0
    if (maxPoints.academicPoints > 0) {
      totalPoints += (teacher.academicPoints / maxPoints.academicPoints) * 65;
      weightSum += 65;
    }

    // Add feedbackPoints if maxPoints.feedbackPoints is greater than 0
    if (maxPoints.feedbackPoints > 0) {
      totalPoints += (teacher.feedbackPoints / maxPoints.feedbackPoints) * 25;
      weightSum += 25;
    }

    // Add otherPoints if maxPoints.otherPoints is greater than 0
    if (maxPoints.otherPoints > 0) {
      totalPoints += (teacher.otherPoints / maxPoints.otherPoints) * 10;
      weightSum += 10;
    }

    // Normalize totalPoints based on weightSum
    if (weightSum > 0) {
      totalPoints = (totalPoints / weightSum) * 100;
    } else {
      totalPoints = 0; // No valid points to calculate
    }

    // Determine performance category
    let performanceCategory;
    if (totalPoints >= 95) performanceCategory = "Outstanding";
    else if (totalPoints >= 85) performanceCategory = "Very Good";
    else if (totalPoints >= 75) performanceCategory = "Good";
    else if (totalPoints >= 65) performanceCategory = "Satisfactory";
    else performanceCategory = "Poor";

    return {
      teacherId: teacher._id,
      teacherName: teacher.teacherInfo.name,
      totalPoints,
      performanceCategory,
    };
  });

  // Sort teachers by total points (descending) and assign ranks
  rankedTeachers.sort((a, b) => b.totalPoints - a.totalPoints);
  rankedTeachers.forEach((teacher, index) => {
    teacher.rank = index + 1;
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rankedTeachers,
        "Teacher ranks calculated successfully"
      )
    );
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
  completeLecturePoints,
  calculateTeacherRanks,
  getComparativePointsData,
  completeStudentGuidedPoints,
  completeContributionPoints,
};
