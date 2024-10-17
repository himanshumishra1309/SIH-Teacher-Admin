import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ExpertLecture } from "../models/expert-lectures.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from 'cloudinary'

const uploadExpertLecture = asyncHandler(async(req, res)=>{
    const {topic, duration, date} = req.body;
    const report = req.file;

    if(!topic || !duration || !date){
        throw new ApiError(400, "All fields are required");
    }

    if(!report){
        throw new ApiError(400, "A report PDF is required");
    }

    const uploadExpertLectureReport = await uploadOnCloudinary(report.path)

    if(!uploadExpertLectureReport){
        throw new ApiError(500, "Couldn't upload the pdf file");
    }

    const uploadedExpertLecture = await ExpertLecture.create({
        topic, 
        duration, 
        date,
        report: uploadExpertLectureReport.secure_url,
        owner: req.user.id
    })

    return res.status(200).json(new ApiResponse(200, uploadedExpertLecture, "Expert Lecture Uploaded Successfully"))
})

const showAllExpertLecture = asyncHandler(async(req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    const [total, expertLectures] = await Promise.all([
        ExpertLecture.countDocuments({owner: req.user._id}),
        ExpertLecture.find({owner: req.user?._id}).sort({createdAt: -1}).skip(skip).limit(limit),
    ]);

    return res.status(200).json(200, {
        total,
        page,
        pages: Math.ceil(total/limit),
        expertLectures
    }, "All the Projects are now visible");

})

const updateExpertLecture = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {topic, duration, date} = req.body;
    const file = req.file;

    const updateFields = {topic, duration, date};

    const expertLecture = await ExpertLecture.findById(id);

    if(!expertLecture){
        throw new ApiError(404, "No such file found in the backend");
    }
    
    if(file){
        if(expertLecture.report){
            const publicId = expertLecture.report.split('/').pop().split('.')[0] // Extract the public_id from the Cloudinary URL
            await cloudinary.uploader.destroy(publicId);
        }

        const uploadExpertLectureReport = await uploadOnCloudinary(file.path)

        if(!uploadExpertLectureReport){
            throw new ApiError(500, "Couldn't upload your new file")
        }

        expertLecture.report = uploadExpertLectureReport.secure_url
    }

    const updatedExpertLecture = await EventParticipation.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
    );

    if(!updatedExpertLecture){
        throw new ApiError(404, "No such file found in the backend");
    }

    return res.status(200).json(new ApiResponse(200, updatedExpertLecture,"Updated the information successfully"));
})

const deleteExpertLecture = asyncHandler(async(req, res)=>{
    const {id} = req.params;

    const findExpertLecture = await ExpertLecture.findById(id);

    if(!findExpertLecture){
        throw new ApiError(404, "File not found");
    }

    await findExpertLecture.remove();

    return res.status(200).json(new ApiResponse(200, null, "Deleted the expert lecture details successfully"))
})

export { uploadExpertLecture, showAllExpertLecture, updateExpertLecture, deleteExpertLecture }