import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ResearchWork } from "../models/ongoing-research.models.js";
import mongoose from "mongoose";

// Add a new research work
const addResearchWork = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        domain,
        funding,
        fundingCategory,
        institution,
        collaborators,
        startDate,
        endDate,
        status
    } = req.body;

    if (
        [title, description, domain, funding, fundingCategory, institution, startDate, status].some(
            field => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const researchWork = await ResearchWork.create({
        title,
        description,
        domain,
        funding,
        fundingCategory,
        institution,
        collaborators,
        startDate,
        endDate,
        status,
        owner: req.teacher._id // Assuming the authenticated teacher is the owner
    });

    return res
        .status(201)
        .json(new ApiResponse(201, researchWork, "Research work added successfully"));
});

// Edit an existing research work
const editResearchWork = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    const researchWork = await ResearchWork.findOneAndUpdate(
        { _id: id, owner: req.teacher._id },
        updateFields,
        { new: true, runValidators: true }
    );

    if (!researchWork) {
        throw new ApiError(404, "Research work not found or you don't have permission to edit");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, researchWork, "Research work updated successfully"));
});

// View all research work
const getAllResearchWork = asyncHandler(async (req, res) => {
    const researchWorks = await ResearchWork.find({ owner: req.teacher._id })
        .populate("collaborators", "name email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, researchWorks, "Research works retrieved successfully"));
});

// Delete a research work or mark it as completed
const deleteOrCompleteResearchWork = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'delete' or 'complete'

    if (!['delete', 'complete'].includes(action)) {
        throw new ApiError(400, "Invalid action. Must be 'delete' or 'complete'");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const researchWork = await ResearchWork.findOne({ _id: id, owner: req.teacher._id }).session(session);

        if (!researchWork) {
            throw new ApiError(404, "Research work not found or you don't have permission");
        }

        if (action === 'complete') {
            // Mark as completed
            researchWork.status = 'Completed';
            await researchWork.save({ session });
        }

        // Delete the research work
        await ResearchWork.findByIdAndDelete(id).session(session);

        await session.commitTransaction();

        return res
            .status(200)
            .json(new ApiResponse(200, {}, `Research work ${action === 'complete' ? 'completed and' : ''} deleted successfully`));

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export {
    addResearchWork,
    editResearchWork,
    getAllResearchWork,
    deleteOrCompleteResearchWork
};