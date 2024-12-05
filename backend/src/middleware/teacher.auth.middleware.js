import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { Teacher } from "../models/teachers.models.js";

export const verifyTeacherJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.teacherAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded token is: ", decodedToken);

    const teacher = await Teacher.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    console.log("teacher in auth.middleware: ", teacher);

    if (!teacher) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
