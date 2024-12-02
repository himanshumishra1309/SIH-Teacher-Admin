import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { Point } from "../models/points.models";

const completeJournalPoints = asyncHandler(async (req, res) => {
  const journalDomains = [
    "International Journal",
    "National Journal",
    "Regional Journal",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total journal points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: journalDomains } }, // Filter by journal domains
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
    throw new ApiError("No journal points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual journal points for the requested teacher
  const journalPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: journalDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by journal type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const journalPoints = journalDomains.reduce((acc, domain) => {
    const entry = journalPointsBreakdown.find((item) => item._id === domain);
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
    journalPoints, // Include journal-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Journal points calculated successfully")
    );
});

const completeBooksPoints = asyncHandler(async (req, res) => {
  const bookDomains = ["International Book", "National Book", "Regional Book"];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total book points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: bookDomains } }, // Filter by book domains
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
    throw new ApiError("No book points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual book points for the requested teacher
  const bookPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: bookDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by book type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const bookPoints = bookDomains.reduce((acc, domain) => {
    const entry = bookPointsBreakdown.find((item) => item._id === domain);
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
    bookPoints, // Include book-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Book points calculated successfully")
    );
});

const completePatentPoints = asyncHandler(async (req, res) => {
  const patentDomains = [
    "International Patent",
    "National Patent",
    "Regional Patent",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total patent points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: patentDomains } }, // Filter by patent domains
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
    throw new ApiError("No patent points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual journal points for the requested teacher
  const patentPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: patentDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by journal type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const patentPoints = patentDomains.reduce((acc, domain) => {
    const entry = patentPointsBreakdown.find((item) => item._id === domain);
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
    patentPoints, // Include journal-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Patent points calculated successfully")
    );
});

const completeProjectsPoints = asyncHandler(async (req, res) => {
  const projectDomains = ["Major Projects", "Minor Projects"];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total project points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: projectDomains } }, // Filter by project domains
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
    throw new ApiError("No project points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual project points for the requested teacher
  const projectPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: projectDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by project type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const projectPoints = projectDomains.reduce((acc, domain) => {
    const entry = projectPointsBreakdown.find((item) => item._id === domain);
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
    projectPoints, // Include project-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Project points calculated successfully")
    );
});

const completeConferencePoints = asyncHandler(async (req, res) => {
  const conferenceDomains = [
    "International Conference",
    "National Conference",
    "Regional Conference",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total conference points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: conferenceDomains } }, // Filter by conference domains
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
    throw new ApiError("No conference points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual conference points for the requested teacher
  const conferencePointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: conferenceDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by conference type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const conferencePoints = conferenceDomains.reduce((acc, domain) => {
    const entry = conferencePointsBreakdown.find((item) => item._id === domain);
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
    conferencePoints, // Include conference-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Conference points calculated successfully"
      )
    );
});

const completeChapterPoints = asyncHandler(async (req, res) => {
  const chapterDomains = [
    "International Chapter",
    "National Chapter",
    "Regional Chapter",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total chapter points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: chapterDomains } }, // Filter by chapter domains
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
    throw new ApiError("No chapter points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual chapter points for the requested teacher
  const chapterPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: chapterDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by chapter type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const chapterPoints = chapterDomains.reduce((acc, domain) => {
    const entry = chapterPointsBreakdown.find((item) => item._id === domain);
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
    chapterPoints, // Include chapter-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Chapter points calculated successfully")
    );
});

const completeSTTPPoints = asyncHandler(async (req, res) => {
  const sttpDomains = [
    "STTP_1_DAY",
    "STTP_2_3_DAYS",
    "STTP_4_5_DAYS",
    "STTP_1_WEEK",
    "STTP_2_WEEKS",
    "STTP_3_WEEKS",
    "STTP_4_WEEKS",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total STTP points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: sttpDomains } }, // Filter by STTP domains
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
    throw new ApiError("No STTP points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual STTP points for the requested teacher
  const sttpPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: sttpDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by STTP type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const sttpPoints = sttpDomains.reduce((acc, domain) => {
    const entry = sttpPointsBreakdown.find((item) => item._id === domain);
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
    sttpPoints, // Include STTP-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "STTP points calculated successfully")
    );
});

const completeEventsConductedPoints = asyncHandler(async (req, res) => {
  const eventDomains = [
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
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total event points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: eventDomains } }, // Filter by event domains
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
    throw new ApiError("No event points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual event points for the requested teacher
  const eventPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: eventDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by event type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const eventPoints = eventDomains.reduce((acc, domain) => {
    const entry = eventPointsBreakdown.find((item) => item._id === domain);
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
    eventPoints, // Include event-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Event points calculated successfully")
    );
});

const completeSeminarAttendedPoints = asyncHandler(async (req, res) => {
  const seminarDomains = [
    "National Seminar",
    "International Seminar",
    "State Seminar",
    "College Seminar",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total seminar points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: seminarDomains } }, // Filter by seminar domains
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
    throw new ApiError("No seminar points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual seminar points for the requested teacher
  const seminarPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: seminarDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by seminar type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const seminarPoints = seminarDomains.reduce((acc, domain) => {
    const entry = seminarPointsBreakdown.find((item) => item._id === domain);
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
    seminarPoints, // Include seminar-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Seminar points calculated successfully")
    );
});

const completeExpertLecturesPoints = asyncHandler(async (req, res) => {
  const expertLecturesDomains = [
    "National Expert Lecture",
    "International Expert Lecture",
    "State Expert Lecture",
    "College Expert Lecture",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total expert lecture points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: expertLecturesDomains } }, // Filter by expert lecture domains
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
    throw new ApiError("No expert lecture points found", 404);
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
      ) + 1
    : null;
  const requestedTeacherPoints = requestedTeacher
    ? requestedTeacher.totalPoints
    : null;
  const requestedTeacherName = requestedTeacher
    ? requestedTeacher.teacher.name
    : null;

  // Fetch individual expert lecture points for the requested teacher
  const expertLecturesPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(teacherId),
        domain: { $in: expertLecturesDomains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by expert lecture type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const expertLecturesPoints = expertLecturesDomains.reduce((acc, domain) => {
    const entry = expertLecturesPointsBreakdown.find(
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
    expertLecturesPoints, // Include expert lecture-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Expert lecture points calculated successfully"
      )
    );
});

const completeSeminarPoints = asyncHandler(async (req, res) => {
  const seminarDomain = "Seminar";

  const { teacherId } = req.params; // Expect teacherId from params

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total seminar points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: seminarDomain }, // Filter by seminar domain
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
    throw new ApiError(404, "No seminar points found");
  }

  // Identify the teacher with the highest points
  const maxPointsEntry = aggregatedPoints[0];
  const highestPoints = maxPointsEntry.totalPoints;
  const teacherWithHighestPoints = maxPointsEntry.teacher.name;

  // Find the requested teacher's rank and points
  const requestedTeacher = aggregatedPoints.find(
    (entry) => entry._id.toString() === teacherId
  );
  const requestedTeacherRank = requestedTeacher
    ? aggregatedPoints.findIndex(
        (entry) => entry._id.toString() === teacherId
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
      "Seminar points calculated successfully"
    )
  );
});

const getComparativePointsData = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required");
    }

    const categoryMapping = {
        'Journal': ['International Journal', 'National Journal', 'Regional Journal'],
        'Book': ['International Book', 'National Book', 'Regional Book'],
        'Chapter': ['International Chapter', 'National Chapter', 'Regional Chapter'],
        'Conference': ['International Conference', 'National Conference', 'Regional Conference'],
        'Patent': ['International Patent', 'National Patent', 'Regional Patent'],
        'Project': ['Major Projects', 'Minor Projects'],
        'STTP': ['STTP_1_DAY', 'STTP_2_3_DAYS', 'STTP_4_5_DAYS', 'STTP_1_WEEK', 'STTP_2_WEEKS', 'STTP_3_WEEKS', 'STTP_4_WEEKS'],
        'Event': [
            'Organizer National Event', 'Organizer International Event', 'Organizer State Event', 'Organizer College Event',
            'Speaker National Event', 'Speaker International Event', 'Speaker State Event', 'Speaker College Event',
            'Judge National Event', 'Judge International Event', 'Judge State Event', 'Judge College Event',
            'Coordinator National Event', 'Coordinator International Event', 'Coordinator State Event', 'Coordinator College Event',
            'Volunteer National Event', 'Volunteer International Event', 'Volunteer State Event', 'Volunteer College Event',
            'Evaluator National Event', 'Evaluator International Event', 'Evaluator State Event', 'Evaluator College Event',
            'Panelist National Event', 'Panelist International Event', 'Panelist State Event', 'Panelist College Event',
            'Mentor National Event', 'Mentor International Event', 'Mentor State Event', 'Mentor College Event',
            'Session Chair National Event', 'Session Chair International Event', 'Session Chair State Event', 'Session Chair College Event',
            'Reviewer National Event', 'Reviewer International Event', 'Reviewer State Event', 'Reviewer College Event'
        ],
        'Seminar': ['National Seminar', 'International Seminar', 'State Seminar', 'College Seminar'],
        'Expert Lecture': ['National Expert Lecture', 'International Expert Lecture', 'State Expert Lecture', 'College Expert Lecture'],
        'Seminar Conducted': ['Seminar']
    };

    const allDomains = Object.values(categoryMapping).flat();

    const comparativeData = await Point.aggregate([
        {
            $match: { domain: { $in: allDomains } }
        },
        {
            $group: {
                _id: {
                    category: {
                        $switch: {
                            branches: Object.entries(categoryMapping).map(([category, domains]) => ({
                                case: { $in: ["$domain", domains] },
                                then: category
                            })),
                            default: "Other"
                        }
                    },
                    owner: "$owner"
                },
                totalPoints: { $sum: "$points" }
            }
        },
        {
            $group: {
                _id: "$_id.category",
                highestPoints: { $max: "$totalPoints" },
                teacherPoints: {
                    $sum: {
                        $cond: [
                            { $eq: ["$_id.owner", mongoose.Types.ObjectId(teacherId)] },
                            "$totalPoints",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                category: "$_id",
                highestPoints: 1,
                teacherPoints: 1,
                _id: 0
            }
        },
        {
            $sort: { category: 1 }
        }
    ]);

    // Prepare data for Chart.js
    const chartData = {
        labels: comparativeData.map(item => item.category),
        datasets: [
            {
                label: 'Highest Points',
                data: comparativeData.map(item => item.highestPoints),
            },
            {
                label: 'Teacher Points',
                data: comparativeData.map(item => item.teacherPoints),
            }
        ]
    };

    res.status(200).json(new ApiResponse(200, { comparativeData, chartData }, "Comparative points data retrieved successfully"));
});

export { completeJournalPoints, completeBooksPoints, completePatentPoints, completeProjectsPoints, completeConferencePoints, completeChapterPoints, completeSTTPPoints, completeEventsConductedPoints, completeSeminarAttendedPoints, completeExpertLecturesPoints,completeSeminarPoints, getComparativePointsData };