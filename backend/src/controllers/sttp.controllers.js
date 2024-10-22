import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { STTP } from "../models/sttp.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadEvent = asyncHandler(async(req, res)=>{
    const {topic, duration, startDate, endDate, venue} = req.body
    const file = req.file;

    if([topic, duration, startDate, endDate, venue].some((field)=> field.trim === "")){
        throw new ApiError(400, "All the fields are required")
    }

    if(!file){
        throw new ApiError(200, "PDF report file is required")
    }

    const uploadResponse = await uploadOnCloudinary(file.path);

    if(!uploadResponse){
        throw new ApiError(500,"error in uploading file to cloudinary")
    }

    const sttp = await STTP.create({
        topic,
        duration,
        startDate,
        endDate,
        venue,
        report: uploadResponse.secure_url, // Store Cloudinary URL
        addedOn: Date.now(),
        owner: req.teacher._id // Assuming authenticated user's ID
    });

    return res.status(200).json(new ApiResponse(201, sttp, "STTP event created successfully"));
})

const showAllEvents = asyncHandler(async(req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)* limit;

    const [total, sttps] = await Promise.all([
        STTP.countDocuments({owner: req.teacher._id}),
        STTP.find({owner: req.teacher._id}).sort({createdAt: -1}).skip(skip).limit(limit),
    ]);

    return res.status(200).json(200, {
        total,
        page,
        pages: Math.ceil(total/limit),
        sttps
    }, "All the STTPs are now visible");
})

const updateEvent = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const {topic, duration, startDate, endDate, venue} = req.body
    const file = req.file

    const sttp = await STTP.findById(id);

    if(!sttp){
        throw new ApiError(400, "No such record found in sttp")
    }

    if (topic) sttp.topic = topic;
    if (duration) sttp.duration = duration;
    if (startDate) sttp.startDate = startDate;
    if (endDate) sttp.endDate = endDate;
    if (venue) sttp.venue = venue;

     // Handle file upload if a new file is provided
    if(file){
        // Delete the previous file from Cloudinary if it exists
        if(sttp.report){
            const publicId = sttp.report.split('/').pop().split('.')[0] // Extract the public_id from the Cloudinary URL
            await cloudinary.uploader.destroy(publicId);
        }

        // Upload the new file to Cloudinary
        const uploadResponse = await uploadOnCloudinary(file.path);

        // Check if the upload was successful
        if (!uploadResponse) {
            throw new ApiError(500, "Error in uploading new file to Cloudinary");
        }

        // Update the report field with the new Cloudinary URL
        sttp.report = uploadResponse.secure_url;
    }

    await sttp.save();

    return res.status(200).json(new ApiResponse(200, sttp, "STTP event updated successfully"))
})

const deleteEvent = asyncHandler(async(req, res)=>{
    const {id} = req.params

    const result = await STTP.findById(id);

    if(!result){
        throw new ApiError(400, "no such file found");
    }

    await result.remove();

    return res.status(200).json(new ApiResponse(201, null, "STTP removed successfully"))
})

export {uploadEvent, showAllEvents, updateEvent, deleteEvent}