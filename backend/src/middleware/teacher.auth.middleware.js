import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Teacher } from "../models/teachers.models.js";

export const verifyTeacherJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.teacherAccessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decoded token is: ", decodedToken);
    
        const user = await Teacher.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user in auth.middleware: ", user);
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})