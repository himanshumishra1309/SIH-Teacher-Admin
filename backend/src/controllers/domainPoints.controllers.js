import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { DomainPoint } from "../models/domainpoints.models.js";

const addPoints = asyncHandler(async (req, res) => {
    const { domain, points } = req.body;
  
    if (!domain || !points) {
      return new ApiError(400, 'Domain and points are required.');
    }
  
    const existingDomain = await DomainPoint.findOne({ domain });
    if (existingDomain) {
      return new ApiError(400, 'Domain already exists.');
    }
  
    const newDomainPoint = await DomainPoint.create({ domain, points });
  
    res.status(201).json(new ApiResponse(201, newDomainPoint, 'Domain points added successfully.'));
});

// Update points for an existing domain
const updatePoints = asyncHandler(async (req, res) => {
    const { domainId } = req.params;
    const { points } = req.body;

    // Validate the presence of `domainId` and `points`
    if (!domainId) {
        throw new ApiError(400, 'Domain ID is required.');
    }
    if (points === undefined) {
        throw new ApiError(400, 'Points are required.');
    }

    // Update the domain points
    const updatedConfig = await DomainPoint.findByIdAndUpdate(
        domainId,                 // Use the domainId to find the record
        { points },               // Update only the points field
        { new: true }             // Return the updated document
    );

    if (!updatedConfig) {
        throw new ApiError(404, 'Domain not found.');
    }

    // Respond with the updated configuration
    res.status(200).json(new ApiResponse(200, updatedConfig, 'Domain points updated successfully.'));
});

// Delete a domain and its points
const deletePoints = asyncHandler(async (req, res) => {
    const { domain } = req.params;
  
    if (!domain) {
      return new ApiError(400, 'Domain is required.');
    }
  
    const deletedConfig = await DomainPoint.findOneAndDelete({ domain });
  
    if (!deletedConfig) {
      return new ApiError(404, 'Domain not found.');
    }
  
    res.status(200).json(new ApiResponse(200, deletedConfig, 'Domain points deleted successfully.'));
});

// Get all domains and their points
const getAllPoints = asyncHandler(async (req, res) => {
    const DomainPoints = await DomainPoint.find();
  
    res.status(200).json(new ApiResponse(200, DomainPoints, 'All domain points fetched successfully.'));
});

export { addPoints, updatePoints, deletePoints, getAllPoints};