import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { Student } from "../models/students.models.js";

export const verifyStudentJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.studentAccessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decoded token is: ", decodedToken);
    
        const student = await Student.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("student in auth.middleware: ", student);
    
        if(!student){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.student = student;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})