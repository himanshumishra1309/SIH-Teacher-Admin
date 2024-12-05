import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { Admin } from "../models/admins.models.js";

export const verifyAdminJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.adminAccessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decoded token is: ", decodedToken);
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("admin in auth.middleware: ", admin);
    
        if(!admin){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})