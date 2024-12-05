import mongoose from "mongoose";
import { Graph } from "../models/graphs.models.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";

const getTeacherGraph = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const graphData = await Graph.find({ owner: teacherId })
    .select("date points -_id")
    .sort({ date: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, graphData, "Graph data fetched successfully."));
});

export { getTeacherGraph };
