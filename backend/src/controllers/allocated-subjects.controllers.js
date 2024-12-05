import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";
import mongoose from "mongoose";

//All the controllers are working

const addSubject = asyncHandler(async (req, res) => {
  const { subject_name, subject_code, subject_credit, branch, year } = req.body;

  if (
    [subject_name, subject_code, branch].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    [subject_credit, year].some(
      (field) => field === undefined || field === null || field === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  // Check for duplicate subject for the same branch and year by the same teacher
  const existingSubject = await AllocatedSubject.findOne({
    subject_code,
    branch,
    year,
    owner: req.teacher._id,
  });

  if (existingSubject) {
    throw new ApiError(
      400,
      "This subject is already added for the specified branch and year"
    );
  }

  const addedSubject = await AllocatedSubject.create({
    subject_name,
    subject_code,
    subject_credit,
    branch,
    year,
    owner: req.teacher._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, addedSubject, "Subject added successfully"));
});

const showAllSubjects = asyncHandler(async (req, res) => {
  const {teacherId} = req.params;

  if(!teacherId){
    throw new ApiError(400, "Teacher id is invalid")
  }

  const subjects = await AllocatedSubject.find({teacher: teacherId});

  if(!subjects || subjects.length === 0){
    throw new ApiError(404, "No subjects are allocated to this teachers")
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subjects,
      },
      "All participated events are now visible"
    )
  );
});

const editSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject_name, subject_code, subject_credit, branch, year } = req.body;

  const updatedSubject = await AllocatedSubject.findByIdAndUpdate(
    id,
    {
      $set: {
        subject_name,
        subject_code,
        subject_credit,
        branch,
        year,
      },
    },
    { new: true } // This returns the updated document
  );

  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubject, "Subject updated successfully"));
});

const removeSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const findSubject = await AllocatedSubject.findById(id);

  if (!findSubject) {
    throw new ApiError(404, "Subject not found");
  }

  await findSubject.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subject removed successfully"));
});

export { addSubject, showAllSubjects, editSubject, removeSubject };
