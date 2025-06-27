import { Weightage } from "../models/weightageAllocation.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";

// Controller to add a new weightage
export const addWeightage = asyncHandler(async (req, res) => {
    const { designation, research, teaching, other } = req.body;

    if (!designation || research == null || teaching == null || other == null) {
        throw new ApiError(400, "All fields are required");
    }

    const newWeightage = await Weightage.create({
        designation,
        research,
        teaching,
        other,
    });

    res.status(201).json(new ApiResponse(201, newWeightage, "Weightage added successfully"));
});

// Controller to edit an existing weightage
export const editWeightage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { research, teaching, other } = req.body;

    if (research == null || teaching == null || other == null) {
        throw new ApiError(400, "All fields are required");
    }

    const updatedWeightage = await Weightage.findByIdAndUpdate(
        id,
        { research, teaching, other },
        { new: true, runValidators: true }
    );

    if (!updatedWeightage) {
        throw new ApiError(404, "Weightage not found");
    }

    res.status(200).json(new ApiResponse(200, updatedWeightage, "Weightage updated successfully"));
});

// Controller to delete a weightage
export const deleteWeightage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedWeightage = await Weightage.findByIdAndDelete(id);

    if (!deletedWeightage) {
        throw new ApiError(404, "Weightage not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Weightage deleted successfully"));
});

// Controller to get all weightages
export const getAllWeightages = asyncHandler(async (req, res) => {
    const weightages = await Weightage.find();

    res.status(200).json(new ApiResponse(200, weightages, "Weightages retrieved successfully"));
});
