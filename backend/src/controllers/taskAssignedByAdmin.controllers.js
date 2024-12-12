import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler2";
import { TaskAssigned } from "../models/taskAssignedByAdmin.models.js";
import mongoose, { mongo } from "mongoose";

const addATask = asyncHandler(async (req, res) => {
    const { title, description, taskType, assignedTo, task, deadline } = req.body;

    if(!mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new ApiError(404, "Teacher not found");
    }

    if (!title || !description || !taskType || !assignedTo || !task || !deadline) {
        throw new ApiError(400, "All fields are required");
    }

    const assignedTask = await TaskAssigned.create({
        title,
        description,
        taskType,
        assignedTo,
        task,
        deadline,
    });

    res.status(201).json(new ApiResponse(201, assignedTask, "Task assigned successfully"));
});

const viewTasks = asyncHandler(async(req, res)=>{
    const {id} = req.params;

    if(!mongo.Types.ObjectId.isValid(id)){
        throw new ApiError(404, "Teacher not found");
    }

    const tasks = await TaskAssigned.find({assignedBy: id});

    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
})

export { addATask, viewTasks };