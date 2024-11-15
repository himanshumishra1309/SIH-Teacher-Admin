import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Contribution } from "../models/extraContributions.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';

const getAllContribution = asyncHandler(async (req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [total, contributions] = await Promise.all([
        Contribution.countDocuments({ owner: req.teacher._id }),
        Contribution.find({ owner: req.teacher._id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
    ]);

    return res.status(200).json(new ApiResponse(200, {
        total,
        page,
        pages: Math.ceil(total / limit),
        contributions,
      },
      "All the contributions are now visible"))
});

const createContribution = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const files = req.files || {};
    
    // Validate required fields
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // Upload images to Cloudinary
    const images = [];
    if (files.images) {
        for (const file of files.images) {
            const result = await uploadOnCloudinary(file.path);
            if (!result || !result.secure_url) {
                throw new ApiError(500, "Failed to upload one or more images. Please try again.");
            }
            images.push(result.secure_url);
        }
    }

    // Upload report to Cloudinary if available
    let report = null;
    if (files.report) {
        const result = await uploadOnCloudinary(files.report[0].path);
        if (!result || !result.secure_url) {
            throw new ApiError(500, "Failed to upload the report. Please try again.");
        }
        report = result.secure_url;
    }

    // Create the contribution document
    const contribution = await Contribution.create({
        title,
        description,
        images,
        report,
        owner: req.teacher._id
    });

    res.status(201).json(new ApiResponse(201, "Contribution created successfully", contribution));
});

const editContribution = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, deleteImages = [], deleteReport } = req.body;
    const files = req.files || {};

    // Find the existing contribution by ID
    const contribution = await Contribution.findById(id);
    if (!contribution) {
        throw new ApiError(404, "Contribution not found");
    }

    if (contribution.owner.toString() !== req.teacher._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this Contribution");
    }

    // Update text fields if provided
    if (title) contribution.title = title;
    if (description) contribution.description = description;

    // Delete specified images if requested
    if (deleteImages.length) {
        contribution.images = contribution.images.filter(
            (img) => !deleteImages.includes(img)
        );

        // Optionally, delete images from Cloudinary
        for (const imageUrl of deleteImages) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
    }

    // Upload new images if provided
    if (files.images) {
        for (const file of files.images) {
            const result = await uploadOnCloudinary(file.path);
            if (!result || !result.secure_url) {
                throw new ApiError(500, "Failed to upload one or more images. Please try again.");
            }
            contribution.images.push(result.secure_url);
        }
    }

    // Delete existing report if requested
    if (deleteReport && contribution.report) {
        const reportPublicId = contribution.report.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(reportPublicId);
        contribution.report = null;  // Remove report from the document
    }

    // Upload new report if provided
    if (files.report) {
        const result = await uploadOnCloudinary(files.report[0].path);
        if (!result || !result.secure_url) {
            throw new ApiError(500, "Failed to upload the report. Please try again.");
        }
        contribution.report = result.secure_url;
    }

    // Save the updated document
    await contribution.save();

    res.status(200).json(new ApiResponse(200, "Contribution updated successfully", contribution));
});

const deleteContribution = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the existing contribution by ID
    const contribution = await Contribution.findById(id);
    if (!contribution) {
        throw new ApiError(404, "Contribution not found");
    }

    if (contribution.owner.toString() !== req.teacher._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this Contribution");
    }

    // Delete each image from Cloudinary
    for (const imageUrl of contribution.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);
    }

    // Optionally, delete the report if it was uploaded
    if (contribution.report) {
        const reportPublicId = contribution.report.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(reportPublicId);
    }

    // Delete the contribution from the database
    await contribution.deleteOne();

    res.status(200).json(new ApiResponse(200, "Contribution deleted successfully"));
});

export { createContribution, editContribution, getAllContribution, deleteContribution};