import { asyncHandler } from "../utils/AsyncHandler2";
import { ApiError } from "@google-cloud/storage";
import { ApiResponse } from "../utils/ApiResponse";
import { TaskAssigned } from "../models/taskAssignedByAdmin.models";
import { HODAssigned } from "../models/taskAssignedByHOD.models";
import { CompletedTask } from "../models/taskCompleted.models";
import mongoose from "mongoose";

const getAssignedTaskForHOD = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

    if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required");
    }

    const tasks = await TaskAssigned.find({ assignedTo: teacherId });

    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

// Controller to assign a task to a teacher
const assignTask = asyncHandler(async (req, res) => {
    const { assignedAt, taskType, totalWork, assignedTo, assignedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new ApiError(404, "Teacher not found");
    }

    if(!mongoose.Types.ObjectId.isValid(assignedBy)){
        throw new ApiError(404, "Teacher not found");
    }

    if (!assignedAt || !taskType || !totalWork) {
        throw new ApiError(400, "All fields are required");
    }

    const assignedTask = await HODAssigned.create({
        assignedAt, taskType, totalWork, assignedTo, assignedBy
    });

    res.status(201).json(new ApiResponse(201, assignedTask, "Task assigned successfully"));
});

const viewAssignedTasksByHOD = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

    if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required");
    }

    const tasks = await HODAssigned.find({ assignedBy: teacherId });

    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getAssignedTasksByHOD = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

    if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required");
    }

    const tasks = await HODAssigned.find({ assignedTo: teacherId });

    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const addCompletedTask = asyncHandler(async (req, res) => {
    const {taskId, completedBy, taskType} = req.body;

    if(!mongoose.Types.ObjectId.isValid(taskId)){
        throw new ApiError(404, "Task not found");
    }

    if(!mongoose.Types.ObjectId.isValid(completedBy)){
        throw new ApiError(404, "Teacher not found");
    }

    if(!taskType){
        throw new ApiError(400, "Task type is required");
    }

    const completedTask = await CompletedTask.create({
        taskId, completedBy, taskType
    });

    res.status(201).json(new ApiResponse(201, completedTask, "Task completed successfully"));
});

export { getAssignedTaskForHOD, assignTask, viewAssignedTasksByHOD, getAssignedTasksByHOD, addCompletedTask };