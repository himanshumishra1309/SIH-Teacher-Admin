import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Student } from "../models/students.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const student = await Student.findById(userId);
    const studentAccessToken = student.generateAccessToken();
    const studentRefreshToken = student.generateRefreshToken();

    student.refreshToken = studentRefreshToken;

    await student.save({ validateBeforeSave: false }); // this is inbuilt in mongoDB to save the info, but there is one problem with this thing and that it will invoke the password field and to stop that we put an object and make it false the thing that we put in the object is validateBeforeSave

    return { studentAccessToken, studentRefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, roll_no, branch, year, password } = req.body;

  if (
    [name, email, roll_no, branch, year, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields is required");
  }

  const existedUser = await Student.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User with email already exists");
  }
  console.log("request(student): ", req.file);

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "No avatar file found");
  }

  const student = await Student.create({
    name,
    email,
    roll_no,
    branch,
    year,
    avatar: avatar.url,
    password,
  });

  const createStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createStudent) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { studentAccessToken, studentRefreshToken } =
    await generateAccessAndRefreshToken(student._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("studentAccessToken", studentAccessToken, options)
    .cookie("studentRefreshToken", studentRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { student: createStudent, studentAccessToken, studentRefreshToken },
        "Student successfully registered"
      )
    );
});

const loginStudent = asyncHandler(async (req, res) => {
  //Todos:
  //1] Get data from req.body
  //2] give either name or email based entry
  //3] Find the user
  //4] Check the password
  //5] Generate access and refresh token and share it to the user
  //6] Send the token in the form of tokens
  //7] Send the response

  console.log("request : ", req);
  console.log("request's body : ", req.body);
  const { email, password } = req.body;

  //this logic is to check if the name or the email is correct, we cant write it this way : !name || !email
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  //this is used to find anyone from the database, by checking the name or email, whichever matches will return
  const user = await Student.findOne({ email });

  //if we didnot get anything then return that user DNE
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // we are not using 'User' rather we will use 'user' which is returned above, because 'User' is an instance of the moongoose of mongoDB and user is the data returned from the data base which signifies a single user and user.models.js file contain all the methods which can be accessed here such as isPasswordCorrect or refreshToken or accessToken
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { studentAccessToken, studentRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await Student.findById(user._id).select(
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
    .cookie("studentAccessToken", studentAccessToken, options)
    .cookie("studentRefreshToken", studentRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          studentAccessToken,
          studentRefreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutStudent = asyncHandler(async (req, res) => {
  Student.findByIdAndUpdate(
    req.student._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset: {
        studentRefreshToken: 1, // this removes the field from the document
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
    .clearCookie("studentAccessToken", options)
    .clearCookie("studentRefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
}); // worked on postman

const getCurrentStudent = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.student, "current user fetched successfully")
    );
}); //worked on postman

const updateAccountDetails = asyncHandler(async (req, res) => {
  console.log("req.body of update account details: ", req.body);
  const { name, email, roll_no, branch, year } = req.body;

  if (!name || !roll_no || !email || !branch || !year) {
    throw new ApiError(400, "All field are requires");
  }

  const student = await Student.findByIdAndUpdate(
    req.student?._id,
    {
      $set: {
        name,
        roll_no,
        email,
        branch,
        year,
      },
    },
    { new: true } // this returns all the values after the fields are updated
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "Account details updated successfully")
    );
});

//todo: delete the previous avatar image from the db and cloudinary
const updateStudentAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; // we are taking the file from multer middleware, also here we are only taking one file as input and therefore we are using 'file', whereas if we wanted to take multiple file we would have written 'files' instead of 'file'

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const student = await Student.findByIdAndUpdate(
    req.student?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, student, "avatar image updated successfully"));
});

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentStudent,
  updateStudentAvatar,
  updateAccountDetails,
};
