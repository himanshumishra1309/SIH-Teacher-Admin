import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { Point } from "../models/points.models.js";
import { Teacher } from "../models/teachers.models.js";
import mongoose from "mongoose";

const completeJournalPoints = asyncHandler(async (req, res) => {
  const journalDomains = [
    "International Journal",
    "National Journal",
    "Regional Journal",
  ];

  // const teacherId = req.teacher._id;
  const { teacherId } = req.params;
  console.log("teacher", teacherId);

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
    (entry) => entry._id.toString() === teacherId.toString()
  );

  // console.log({requestedTeacher})
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

  // Fetch individual journal points for the requested teacher
  const journalPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId), // changes (new keyword added)
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

const completeJournal2Points = asyncHandler(async (req, res) => {
  const journal2Domains = [
    "Nature (journal)",
    "IEEE/CVF Conference on Computer Vision and Pattern Recognition (journal)",
    "The New England Journal of Medicine (journal)",
    "Science (journal)",
    "Nature Communications (journal)",
    "The Lancet (journal)",
    "Neural Information Processing Systems (journal)",
    "Advanced Materials (journal)",
    "Cell (journal)",
    "International Conference on Learning Representations (journal)",
    "JAMA (journal)",
    "Science of The Total Environment (journal)",
    "IEEE/CVF International Conference on Computer Vision (journal)",
    "Angewandte Chemie International Edition (journal)",
    "Nature Medicine (journal)",
    "Journal of Cleaner Production (journal)",
    "International Conference on Machine Learning (journal)",
    "Chemical Reviews (journal)",
    "Proceedings of the National Academy of Sciences (journal)",
    "IEEE Access (journal)",
    "Chemical Society Reviews (journal)",
    "International Journal of Molecular Sciences (journal)",
    "Advanced Functional Materials (journal)",
    "Advanced Energy Materials (journal)",
    "Journal of the American Chemical Society (journal)",
    "Nucleic Acids Research (journal)",
    "Chemical Engineering Journal (journal)",
    "International Journal of Environmental Research and Public Health (journal)",
    "PLOS ONE (journal)",
    "BMJ (journal)",
    "Science Advances (journal)",
    "Sustainability (journal)",
    "ACS Nano (journal)",
    "Scientific Reports (journal)",
    "AAAI Conference on Artificial Intelligence (journal)",
    "Meeting of the Association for Computational Linguistics (ACL) (journal)",
    "Frontiers in Immunology (journal)",
    "Journal of Clinical Oncology (journal)",
    "Energy & Environmental Science (journal)",
    "Physical Review Letters (journal)",
    "Applied Catalysis B: Environmental (journal)",
    "Circulation (journal)",
    "Journal of Business Research (journal)",
    "Nutrients (journal)",
    "Renewable and Sustainable Energy Reviews (journal)",
    "European Conference on Computer Vision (journal)",
    "The Lancet Oncology (journal)",
    "Journal of Hazardous Materials (journal)",
    "IEEE Transactions on Pattern Analysis and Machine Intelligence (journal)",
    "Morbidity and Mortality Weekly Report (journal)",
    "Conference on Empirical Methods in Natural Language Processing (EMNLP) (journal)",
    "Nature Biotechnology (journal)",
    "Journal of the American College of Cardiology (journal)",
    "Sensors (journal)",
    "Nature Materials (journal)",
    "Applied Energy (journal)",
    "Nano Energy (journal)",
    "Nature Genetics (journal)",
    "Joule (journal)",
    "Technological Forecasting and Social Change (journal)",
    "IEEE Internet of Things Journal (journal)",
    "Frontiers in Psychology (journal)",
    "Molecules (journal)",
    "Journal of Materials Chemistry A (journal)",
    "Environmental Science & Technology (journal)",
    "Chemosphere (journal)",
    "The Lancet Infectious Diseases (journal)",
    "JAMA Network Open (journal)",
    "ACS Applied Materials & Interfaces (journal)",
    "Clinical Infectious Diseases (journal)",
    "Nature Energy (journal)",
    "Gastroenterology (journal)",
    "ACS Catalysis (journal)",
    "Advanced Science (journal)",
    "Nature Nanotechnology (journal)",
    "Annals of Oncology (journal)",
    "Gut (journal)",
    "Journal of Environmental Management (journal)",
    "Molecular Cancer (journal)",
    "European Heart Journal (journal)",
    "Physical Review D (journal)",
    "Nature Methods (journal)",
    "Environmental Pollution (journal)",
    "The Astrophysical Journal (journal)",
    "IEEE Transactions on Industrial Informatics (journal)",
    "ACS Energy Letters (journal)",
    "Immunity (journal)",
    "International Journal of Information Management (journal)",
    "Cells (journal)",
    "Expert Systems with Applications (journal)",
    "Water Research (journal)",
    "Applied Sciences (journal)",
    "Energy (journal)",
    "Small (journal)",
    "Environmental Science and Pollution Research (journal)",
    "Renewable Energy (journal)",
    "Bioresource Technology (journal)",
    "Nature Reviews Immunology (journal)",
    "Energy Storage Materials (journal)",
    "Coordination Chemistry Reviews (journal)",
  ];

  const { teacherId } = req.params;
  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total journal2 points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: journal2Domains } }, // Filter by journal2 domains
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

  // If no points history, return all teachers with zero points
  if (aggregatedPoints.length === 0) {
    const allTeachers = await Teacher.find();
    const response = {
      highestPoints: 0,
      teacherWithHighestPoints: null,
      teachers: allTeachers.map((teacher, index) => ({
        rank: index + 1,
        teacherName: teacher.name,
        totalPoints: 0,
      })),
      requestedTeacherRank: null,
      requestedTeacherName: null,
      requestedTeacherPoints: 0,
      journal2Points: journal2Domains.reduce((acc, domain) => {
        acc[domain] = 0;
        return acc;
      }, {}),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "No journal2 points found, returning all teachers with zero points")
      );
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

  // Fetch individual journal2 points for the requested teacher
  const journal2PointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
        domain: { $in: journal2Domains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by journal2 type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const journal2Points = journal2Domains.reduce((acc, domain) => {
    const entry = journal2PointsBreakdown.find((item) => item._id === domain);
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
    journal2Points, // Include journal2-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Journal2 points calculated successfully")
    );
});

const completeBooksPoints = asyncHandler(async (req, res) => {
  const bookDomains = ["International Book", "National Book", "Regional Book"];

  const { teacherId } = req.params; // Expect teacherId from params
  // const teacherId = req.teacher._id;
  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
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

  // Fetch individual book points for the requested teacher
  const bookPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

const completeBooks2Points = asyncHandler(async (req, res) => {
  const book2Domains = [
    "Nature (book)",
          "IEEE/CVF Conference on Computer Vision and Pattern Recognition (book)",
          "The New England Journal of Medicine (book)",
          "Science (book)",
          "Nature Communications (book)",
          "The Lancet (book)",
          "Neural Information Processing Systems (book)",
          "Advanced Materials (book)",
          "Cell (book)",
          "International Conference on Learning Representations (book)",
          "JAMA (book)",
          "Science of The Total Environment (book)",
          "IEEE/CVF International Conference on Computer Vision (book)",
          "Angewandte Chemie International Edition (book)",
          "Nature Medicine (book)",
          "Journal of Cleaner Production (book)",
          "International Conference on Machine Learning (book)",
          "Chemical Reviews (book)",
          "Proceedings of the National Academy of Sciences (book)",
          "IEEE Access (book)",
          "Chemical Society Reviews (book)",
          "International Journal of Molecular Sciences (book)",
          "Advanced Functional Materials (book)",
          "Advanced Energy Materials (book)",
          "Journal of the American Chemical Society (book)",
          "Nucleic Acids Research (book)",
          "Chemical Engineering Journal (book)",
          "International Journal of Environmental Research and Public Health (book)",
          "PLOS ONE (book)",
          "BMJ (book)",
          "Science Advances (book)",
          "Sustainability (book)",
          "ACS Nano (book)",
          "Scientific Reports (book)",
          "AAAI Conference on Artificial Intelligence (book)",
          "Meeting of the Association for Computational Linguistics (ACL) (book)",
          "Frontiers in Immunology (book)",
          "Journal of Clinical Oncology (book)",
          "Energy & Environmental Science (book)",
          "Physical Review Letters (book)",
          "Applied Catalysis B: Environmental (book)",
          "Circulation (book)",
          "Journal of Business Research (book)",
          "Nutrients (book)",
          "Renewable and Sustainable Energy Reviews (book)",
          "European Conference on Computer Vision (book)",
          "The Lancet Oncology (book)",
          "Journal of Hazardous Materials (book)",
          "IEEE Transactions on Pattern Analysis and Machine Intelligence (book)",
          "Morbidity and Mortality Weekly Report (book)",
          "Conference on Empirical Methods in Natural Language Processing (EMNLP) (book)",
          "Nature Biotechnology (book)",
          "Journal of the American College of Cardiology (book)",
          "Sensors (book)",
          "Nature Materials (book)",
          "Applied Energy (book)",
          "Nano Energy (book)",
          "Nature Genetics (book)",
          "Joule (book)",
          "Technological Forecasting and Social Change (book)",
          "IEEE Internet of Things Journal (book)",
          "Frontiers in Psychology (book)",
          "Molecules (book)",
          "Journal of Materials Chemistry A (book)",
          "Environmental Science & Technology (book)",
          "Chemosphere (book)",
          "The Lancet Infectious Diseases (book)",
          "JAMA Network Open (book)",
          "ACS Applied Materials & Interfaces (book)",
          "Clinical Infectious Diseases (book)",
          "Nature Energy (book)",
          "Gastroenterology (book)",
          "ACS Catalysis (book)",
          "Advanced Science (book)",
          "Nature Nanotechnology (book)",
          "Annals of Oncology (book)",
          "Gut (book)",
          "Journal of Environmental Management (book)",
          "Molecular Cancer (book)",
          "European Heart Journal (book)",
          "Physical Review D (book)",
          "Nature Methods (book)",
          "Environmental Pollution (book)",
          "The Astrophysical Journal (book)",
          "IEEE Transactions on Industrial Informatics (book)",
          "ACS Energy Letters (book)",
          "Immunity (book)",
          "International Journal of Information Management (book)",
          "Cells (book)",
          "Expert Systems with Applications (book)",
          "Water Research (book)",
          "Applied Sciences (book)",
          "Energy (book)",
          "Small (book)",
          "Environmental Science and Pollution Research (book)",
          "Renewable Energy (book)",
          "Bioresource Technology (book)",
          "Nature Reviews Immunology (book)",
          "Energy Storage Materials (book)",
          "Coordination Chemistry Reviews (book)",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  // const teacherId = req.teacher._id;
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total book2 points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: book2Domains } }, // Filter by book2 domains
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
    const allTeachers = await Teacher.find();
    const response = {
      highestPoints: 0,
      teacherWithHighestPoints: null,
      teachers: allTeachers.map((teacher, index) => ({
        rank: index + 1,
        teacherName: teacher.name,
        totalPoints: 0,
      })),
      requestedTeacherRank: null,
      requestedTeacherName: null,
      requestedTeacherPoints: 0,
      book2Domains: book2Domains.reduce((acc, domain) => {
        acc[domain] = 0;
        return acc;
      }, {}),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "No journal2 points found, returning all teachers with zero points")
      );
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

  // Fetch individual book2 points for the requested teacher
  const book2PointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
        domain: { $in: book2Domains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by book2 type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const book2Points = book2Domains.reduce((acc, domain) => {
    const entry = book2PointsBreakdown.find((item) => item._id === domain);
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
    book2Points, // Include book2-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Book2 points calculated successfully")
    );
});

const completePatentPoints = asyncHandler(async (req, res) => {
  const patentDomains = [
    "International Patent",
    "National Patent",
    "Regional Patent",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  // const teacherId = req.teacher._id;
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

  // Fetch individual journal points for the requested teacher
  const patentPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

const completePatent2Points = asyncHandler(async (req, res) => {
  const patent2Domains = [
    "Nature (patent)",
            "IEEE/CVF Conference on Computer Vision and Pattern Recognition (patent)",
            "The New England Journal of Medicine (patent)",
            "Science (patent)",
            "Nature Communications (patent)",
            "The Lancet (patent)",
            "Neural Information Processing Systems (patent)",
            "Advanced Materials (patent)",
            "Cell (patent)",
            "International Conference on Learning Representations (patent)",
            "JAMA (patent)",
            "Science of The Total Environment (patent)",
            "IEEE/CVF International Conference on Computer Vision (patent)",
            "Angewandte Chemie International Edition (patent)",
            "Nature Medicine (patent)",
            "Journal of Cleaner Production (patent)",
            "International Conference on Machine Learning (patent)",
            "Chemical Reviews (patent)",
            "Proceedings of the National Academy of Sciences (patent)",
            "IEEE Access (patent)",
            "Chemical Society Reviews (patent)",
            "International Journal of Molecular Sciences (patent)",
            "Advanced Functional Materials (patent)",
            "Advanced Energy Materials (patent)",
            "Journal of the American Chemical Society (patent)",
            "Nucleic Acids Research (patent)",
            "Chemical Engineering Journal (patent)",
            "International Journal of Environmental Research and Public Health (patent)",
            "PLOS ONE (patent)",
            "BMJ (patent)",
            "Science Advances (patent)",
            "Sustainability (patent)",
            "ACS Nano (patent)",
            "Scientific Reports (patent)",
            "AAAI Conference on Artificial Intelligence (patent)",
            "Meeting of the Association for Computational Linguistics (ACL) (patent)",
            "Frontiers in Immunology (patent)",
            "Journal of Clinical Oncology (patent)",
            "Energy & Environmental Science (patent)",
            "Physical Review Letters (patent)",
            "Applied Catalysis B: Environmental (patent)",
            "Circulation (patent)",
            "Journal of Business Research (patent)",
            "Nutrients (patent)",
            "Renewable and Sustainable Energy Reviews (patent)",
            "European Conference on Computer Vision (patent)",
            "The Lancet Oncology (patent)",
            "Journal of Hazardous Materials (patent)",
            "IEEE Transactions on Pattern Analysis and Machine Intelligence (patent)",
            "Morbidity and Mortality Weekly Report (patent)",
            "Conference on Empirical Methods in Natural Language Processing (EMNLP) (patent)",
            "Nature Biotechnology (patent)",
            "Journal of the American College of Cardiology (patent)",
            "Sensors (patent)",
            "Nature Materials (patent)",
            "Applied Energy (patent)",
            "Nano Energy (patent)",
            "Nature Genetics (patent)",
            "Joule (patent)",
            "Technological Forecasting and Social Change (patent)",
            "IEEE Internet of Things Journal (patent)",
            "Frontiers in Psychology (patent)",
            "Molecules (patent)",
            "Journal of Materials Chemistry A (patent)",
            "Environmental Science & Technology (patent)",
            "Chemosphere (patent)",
            "The Lancet Infectious Diseases (patent)",
            "JAMA Network Open (patent)",
            "ACS Applied Materials & Interfaces (patent)",
            "Clinical Infectious Diseases (patent)",
            "Nature Energy (patent)",
            "Gastroenterology (patent)",
            "ACS Catalysis (patent)",
            "Advanced Science (patent)",
            "Nature Nanotechnology (patent)",
            "Annals of Oncology (patent)",
            "Gut (patent)",
            "Journal of Environmental Management (patent)",
            "Molecular Cancer (patent)",
            "European Heart Journal (patent)",
            "Physical Review D (patent)",
            "Nature Methods (patent)",
            "Environmental Pollution (patent)",
            "The Astrophysical Journal (patent)",
            "IEEE Transactions on Industrial Informatics (patent)",
            "ACS Energy Letters (patent)",
            "Immunity (patent)",
            "International Journal of Information Management (patent)",
            "Cells (patent)",
            "Expert Systems with Applications (patent)",
            "Water Research (patent)",
            "Applied Sciences (patent)",
            "Energy (patent)",
            "Small (patent)",
            "Environmental Science and Pollution Research (patent)",
            "Renewable Energy (patent)",
            "Bioresource Technology (patent)",
            "Nature Reviews Immunology (patent)",
            "Energy Storage Materials (patent)",
            "Coordination Chemistry Reviews (patent)",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  // const teacherId = req.teacher._id;
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total patent2 points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: patent2Domains } }, // Filter by patent2 domains
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
    const allTeachers = await Teacher.find();
    const response = {
      highestPoints: 0,
      teacherWithHighestPoints: null,
      teachers: allTeachers.map((teacher, index) => ({
        rank: index + 1,
        teacherName: teacher.name,
        totalPoints: 0,
      })),
      requestedTeacherRank: null,
      requestedTeacherName: null,
      requestedTeacherPoints: 0,
      patent2Domains: patent2Domains.reduce((acc, domain) => {
        acc[domain] = 0;
        return acc;
      }, {}),
    };
  

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "No journal2 points found, returning all teachers with zero points")
      );
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

  // Fetch individual patent2 points for the requested teacher
  const patent2PointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
        domain: { $in: patent2Domains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by patent2 type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const patent2Points = patent2Domains.reduce((acc, domain) => {
    const entry = patent2PointsBreakdown.find((item) => item._id === domain);
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
    patent2Points, // Include patent2-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Patent2 points calculated successfully")
    );
});

const completeProjectsPoints = asyncHandler(async (req, res) => {
  const projectDomains = ["Major Projects", "Minor Projects"];

  const { teacherId } = req.params; // Expect teacherId from params
  // const teacherId = req.teacher._id;
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

  // Fetch individual project points for the requested teacher
  const projectPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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
  // const teacherId = req.teacher._id;
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

  // Fetch individual conference points for the requested teacher
  const conferencePointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

const completeConference2Points = asyncHandler(async (req, res) => {
  const conference2Domains = [
    "Nature (conference)",
              "IEEE/CVF Conference on Computer Vision and Pattern Recognition (conference)",
              "The New England Journal of Medicine (conference)",
              "Science (conference)",
              "Nature Communications (conference)",
              "The Lancet (conference)",
              "Neural Information Processing Systems (conference)",
              "Advanced Materials (conference)",
              "Cell (conference)",
              "International Conference on Learning Representations (conference)",
              "JAMA (conference)",
              "Science of The Total Environment (conference)",
              "IEEE/CVF International Conference on Computer Vision (conference)",
              "Angewandte Chemie International Edition (conference)",
              "Nature Medicine (conference)",
              "Journal of Cleaner Production (conference)",
              "International Conference on Machine Learning (conference)",
              "Chemical Reviews (conference)",
              "Proceedings of the National Academy of Sciences (conference)",
              "IEEE Access (conference)",
              "Chemical Society Reviews (conference)",
              "International Journal of Molecular Sciences (conference)",
              "Advanced Functional Materials (conference)",
              "Advanced Energy Materials (conference)",
              "Journal of the American Chemical Society (conference)",
              "Nucleic Acids Research (conference)",
              "Chemical Engineering Journal (conference)",
              "International Journal of Environmental Research and Public Health (conference)",
              "PLOS ONE (conference)",
              "BMJ (conference)",
              "Science Advances (conference)",
              "Sustainability (conference)",
              "ACS Nano (conference)",
              "Scientific Reports (conference)",
              "AAAI Conference on Artificial Intelligence (conference)",
              "Meeting of the Association for Computational Linguistics (ACL) (conference)",
              "Frontiers in Immunology (conference)",
              "Journal of Clinical Oncology (conference)",
              "Energy & Environmental Science (conference)",
              "Physical Review Letters (conference)",
              "Applied Catalysis B: Environmental (conference)",
              "Circulation (conference)",
              "Journal of Business Research (conference)",
              "Nutrients (conference)",
              "Renewable and Sustainable Energy Reviews (conference)",
              "European Conference on Computer Vision (conference)",
              "The Lancet Oncology (conference)",
              "Journal of Hazardous Materials (conference)",
              "IEEE Transactions on Pattern Analysis and Machine Intelligence (conference)",
              "Morbidity and Mortality Weekly Report (conference)",
              "Conference on Empirical Methods in Natural Language Processing (EMNLP) (conference)",
              "Nature Biotechnology (conference)",
              "Journal of the American College of Cardiology (conference)",
              "Sensors (conference)",
              "Nature Materials (conference)",
              "Applied Energy (conference)",
              "Nano Energy (conference)",
              "Nature Genetics (conference)",
              "Joule (conference)",
              "Technological Forecasting and Social Change (conference)",
              "IEEE Internet of Things Journal (conference)",
              "Frontiers in Psychology (conference)",
              "Molecules (conference)",
              "Journal of Materials Chemistry A (conference)",
              "Environmental Science & Technology (conference)",
              "Chemosphere (conference)",
              "The Lancet Infectious Diseases (conference)",
              "JAMA Network Open (conference)",
              "ACS Applied Materials & Interfaces (conference)",
              "Clinical Infectious Diseases (conference)",
              "Nature Energy (conference)",
              "Gastroenterology (conference)",
              "ACS Catalysis (conference)",
              "Advanced Science (conference)",
              "Nature Nanotechnology (conference)",
              "Annals of Oncology (conference)",
              "Gut (conference)",
              "Journal of Environmental Management (conference)",
              "Molecular Cancer (conference)",
              "European Heart Journal (conference)",
              "Physical Review D (conference)",
              "Nature Methods (conference)",
              "Environmental Pollution (conference)",
              "The Astrophysical Journal (conference)",
              "IEEE Transactions on Industrial Informatics (conference)",
              "ACS Energy Letters (conference)",
              "Immunity (conference)",
              "International Journal of Information Management (conference)",
              "Cells (conference)",
              "Expert Systems with Applications (conference)",
              "Water Research (conference)",
              "Applied Sciences (conference)",
              "Energy (conference)",
              "Small (conference)",
              "Environmental Science and Pollution Research (conference)",
              "Renewable Energy (conference)",
              "Bioresource Technology (conference)",
              "Nature Reviews Immunology (conference)",
              "Energy Storage Materials (conference)",
              "Coordination Chemistry Reviews (conference)",
  ];

  const { teacherId } = req.params; // Expect teacherId from params
  // const teacherId = req.teacher._id;
  if (!teacherId) {
    throw new ApiError("Teacher ID is required", 400);
  }

  // Aggregate total conference2 points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain: { $in: conference2Domains } }, // Filter by conference2 domains
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
    const allTeachers = await Teacher.find();
    const response = {
      highestPoints: 0,
      teacherWithHighestPoints: null,
      teachers: allTeachers.map((teacher, index) => ({
        rank: index + 1,
        teacherName: teacher.name,
        totalPoints: 0,
      })),
      requestedTeacherRank: null,
      requestedTeacherName: null,
      requestedTeacherPoints: 0,
      conference2Domains: conference2Domains.reduce((acc, domain) => {
        acc[domain] = 0;
        return acc;
      }, {}),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "No conference2 points found, returning all teachers with zero points")
      );
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

  // Fetch individual conference2 points for the requested teacher
  const conference2PointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
        domain: { $in: conference2Domains },
      },
    },
    {
      $group: {
        _id: "$domain", // Group by conference2 type
        totalPoints: { $sum: "$points" }, // Sum points for each type
      },
    },
  ]);

  // Format breakdown as a dictionary for clarity
  const conference2Points = conference2Domains.reduce((acc, domain) => {
    const entry = conference2PointsBreakdown.find((item) => item._id === domain);
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
    conference2Points, // Include conference2-specific points for requested teacher
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Conference2 points calculated successfully")
    );
});

const completeChapterPoints = asyncHandler(async (req, res) => {
  const chapterDomains = [
    "International Chapter",
    "National Chapter",
    "Regional Chapter",
  ];
  // const teacherId = req.teacher._id;
  const { teacherId } = req.params;
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

  // Fetch individual chapter points for the requested teacher
  const chapterPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

  // const teacherId = req.teacher._id;
  const { teacherId } = req.params;
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

  // Fetch individual STTP points for the requested teacher
  const sttpPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

  // const teacherId = req.teacher._id;
  const { teacherId } = req.params;
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

  // Fetch individual event points for the requested teacher
  const eventPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

  // const teacherId = req.teacher._id;
  const { teacherId } = req.params;
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

  // Fetch individual seminar points for the requested teacher
  const seminarPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

  // const teacherId = req.teacher._id;
  const { teacherId } = req.params;
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

  // Fetch individual expert lecture points for the requested teacher
  const expertLecturesPointsBreakdown = await Point.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(teacherId),
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

  // const teacherId = req.teacher._id; // Expect teacherId from params
  const { teacherId } = req.params;

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
      "Seminar points calculated successfully"
    )
  );
});

const getComparativePointsData = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  // const teacherId = req.teacher._id;
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

  const { teacherId } = req.params;

  if (!teacherId) {
    throw new ApiError(400, "Teacher ID is required");
  }

  // Aggregate total lecture points for each teacher
  const aggregatedPoints = await Point.aggregate([
    {
      $match: { domain : {$in : lectureDomain}}, // Filter by lecture domain
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

  const { teacherId } = req.params;

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
  const studentGuidedDomains = ["Mtech Students Guided", "PhD Students Guided"];

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

export {
  completeJournalPoints,
  completeJournal2Points,
  completeBooks2Points,
  completePatent2Points,
  completeConference2Points,
  completeBooksPoints,
  completePatentPoints,
  completeProjectsPoints,
  completeConferencePoints,
  completeChapterPoints,
  completeSTTPPoints,
  completeEventsConductedPoints,
  completeSeminarAttendedPoints,
  completeExpertLecturesPoints,
  completeSeminarPoints,
  getComparativePointsData,
  calculateTeacherRanks,
  completeContributionPoints,
  completeStudentGuidedPoints,
  completeLecturePoints,
};
