import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";

const addSubject = asyncHandler(async(req, res)=>{
    const {subject_name, subject_code, subject_credit, branch, year} = req.body

    if([subject_name, subject_code, subject_credit, branch, year].some((field)=> field.trim() === "")){
        throw new ApiError(400, "All Fields are required");
    }

    const addedSubject = await AllocatedSubject.create({
        subject_name, subject_code, subject_credit, branch, year,
        owner: req.user._id,
    })

    return res.status(200).json(new ApiResponse(200, addedSubject, "Subject added successfully"))
})

const showAllSubjects = asyncHandler(async(req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)* limit;

    const [total, subjects] = await Promise.all([
        AllocatedSubject.countDocuments({owner: req.user?._id}),
        AllocatedSubject.find({owner: req.user._id}).sort({createdAt: -1}).skip(skip).limit(limit)
    ]);

    return res.status(200).json(new ApiResponse(200, {
        total,
        page,
        pages: Math.ceil(total/limit),
        events
    }, "All participated events are now visible"));
})

const editSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { subject_name, subject_code, subject_credit, branch, year } = req.body;

    const updatedSubject = await AllocatedSubject.findByIdAndUpdate(
        id,
        {
            $set: {
                subject_name,
                subject_code,
                subject_credit,
                branch,
                year
            }
        },
        { new: true } // This returns the updated document
    );

    if (!updatedSubject) {
        throw new ApiError(404, "Subject not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedSubject, "Subject updated successfully"));
});

const removeSubject = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const findSubject = await AllocatedSubject.findById(id);

    if(!findSubject){
        throw new ApiError(404, "Subject not found");
    }

    await findSubject.remove();

    return res.status(200).json(new ApiResponse(200, null, "Subject removed successfully"));
})

export {addSubject, showAllSubjects, editSubject, removeSubject}