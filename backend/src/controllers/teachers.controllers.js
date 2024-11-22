import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Teacher } from "../models/teachers.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Ensure you await the database query to get the actual teacher object
    const teacher = await Teacher.findById(userId);

    // If no teacher is found, throw an error
    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }

    // Generate tokens using the teacher methods
    const teacherAccessToken = teacher.generateAccessToken();
    const teacherRefreshToken = teacher.generateRefreshToken();

    // Update teacher's refresh token in the database
    teacher.refreshToken = teacherRefreshToken;

    // Save the teacher without triggering validation (like password re-hashing)
    await teacher.save({ validateBeforeSave: false });

    // Return the tokens
    return { teacherAccessToken, teacherRefreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error); // Optional: for debugging purposes
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const loginTeacher = asyncHandler(async (req, res) => {
  console.log("request : ", req);
  console.log("request's body : ", req.body);
  const { email, password } = req.body;

  //this logic is to check if the name or the email is correct, we cant write it this way : !name || !email
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  //this is used to find anyone from the database, by checking the name or email, whichever matches will return
  const user = await Teacher.findOne({ email });

  //if we didnot get anything then return that user DNE
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // we are not using 'User' rather we will use 'user' which is returned above, because 'User' is an instance of the moongoose of mongoDB and user is the data returned from the data base which signifies a single user and user.models.js file contain all the methods which can be accessed here such as isPasswordCorrect or refreshToken or accessToken
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { teacherAccessToken, teacherRefreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await Teacher.findById(user._id).select(
    "-password -refreshToken"
  );

  //now we will be adding functionality to return cookies, and for doing that securely such that the frontend could access those cookies but cannot modify them and also the cookies can only be modified using the backend server
  const options = {
    httpOnly: true,
    secure: true,
  };

  // cookie("accessToken", accessToken, options) this is the way of generating
  return res
    .status(200)
    .cookie("teacherAccessToken", teacherAccessToken, options)
    .cookie("teacherRefreshToken", teacherRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          teacherAccessToken,
          teacherRefreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutTeacher = asyncHandler(async (req, res) => {
  await Teacher.findByIdAndUpdate(
    req.teacher._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset: {
        teacherRefreshToken: 1, // this removes the field from the document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("teacherAccessToken", options)
    .clearCookie("teacherAccessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export {
  loginTeacher,
  logoutTeacher,
};
