import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Contribution } from "../models/extraContributions.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';

const createContribution = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const files = req.files || {};
    const images = files.images ? files.images.map(file => file.path) : [];
    const report = files.report ? files.report[0].path : null;

    // Validate required fields
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // Create the contribution document
    const contribution = await Contribution.create({
        title,
        description,
        images,
        report,
    });

    res.status(201).json(new ApiResponse(201, "Contribution created successfully", contribution));
});

const editContribution = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const files = req.files || {};
    const images = files.images ? files.images.map(file => file.path) : undefined;
    const report = files.report ? files.report[0].path : undefined;

    // Find the existing contribution by ID
    const contribution = await Contribution.findById(id);
    if (!contribution) {
        throw new ApiError(404, "Contribution not found");
    }

    // Update the fields only if they are provided in the request
    if (title) contribution.title = title;
    if (description) contribution.description = description;
    if (images) contribution.images = images;
    if (report) contribution.report = report;

    // Save the updated document
    await contribution.save();

    res.status(200).json(new ApiResponse(200, "Contribution updated successfully", contribution));
});

export { createContribution, editContribution };