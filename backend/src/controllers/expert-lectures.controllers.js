import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ExpertLecture } from "../models/expert-lectures.models.js";
import { uploadToGCS } from "../utils/googleCloud.js";
import path from "path"
import { Storage } from "@google-cloud/storage";
const storage = new Storage();

const uploadExpertLecture = asyncHandler(async (req, res) => {
  const { topic, duration, date, level, venue } = req.body;
  const report = req.file;

  if (!topic || !duration || !date || !venue || !level) {
    throw new ApiError(400, "All fields are required");
  }

  if (!report) {
    throw new ApiError(400, "A report PDF is required");
  }

  // const uploadExpertLectureReport = await uploadOnCloudinary(report.path);
  const uploadExpertLectureReport = await uploadToGCS(
    report.path,
    "pdf-report"
  );

  if (!uploadExpertLectureReport) {
    throw new ApiError(500, "Couldn't upload the pdf file");
  }

  const uploadedExpertLecture = await ExpertLecture.create({
    topic,
    duration,
    date,
    level,
    venue,
    report: uploadExpertLectureReport,
    owner: req.teacher.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uploadedExpertLecture,
        "Expert Lecture Uploaded Successfully"
      )
    );
});

const showAllExpertLecture = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, expertLectures] = await Promise.all([
    ExpertLecture.countDocuments({ owner: req.teacher._id }),
    ExpertLecture.find({ owner: req.teacher?._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page,
        pages: Math.ceil(total / limit),
        expertLectures,
      },
      "All the Projects are now visible"
    )
  );
});

const updateExpertLecture = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { topic, duration, date } = req.body;
  const file = req.file;

  const expertLecture = await ExpertLecture.findById(id);
  
  if(!expertLecture){
    throw new ApiError(400, 'No such record found in Expert Lecture');
  }

  if(topic) expertLecture.topic = topic;
  if(duration) expertLecture.duration = duration;
  if(date) expertLecture.date = date;
  

  if (file) {
    // Delete the previous file from GCS if it exists
    // if (expertLecture.report) {
    //   const publicUrlParts = expertLecture.report.split('/');
    //   const fileName = publicUrlParts.slice(-2).join('/'); // Extract folder and filename
    //   await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).file(fileName).delete();
    // }

    // Detect file type and set folder
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const folder = fileExtension === '.pdf' ? 'pdf-reports' : 'images';

    // Upload the new file to the appropriate folder
    const fileUrl = await uploadToGCS(file.path, folder);

    // Check if the upload was successful
    if (!fileUrl) {
      throw new ApiError(500, 'Error in uploading new file to Google Cloud');
    }

    // Update the report field with the new public URL
    expertLecture.report = fileUrl;
  }

  await expertLecture.save();

  if (!expertLecture) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        expertLecture,
        "Updated the information successfully"
      )
    );
});

const deleteExpertLecture = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const findExpertLecture = await ExpertLecture.findByIdAndDelete(id);

  if (!findExpertLecture) {
    throw new ApiError(404, "File not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Deleted the expert lecture details successfully"
      )
    );
});

export {
  uploadExpertLecture,
  showAllExpertLecture,
  updateExpertLecture,
  deleteExpertLecture,
};
