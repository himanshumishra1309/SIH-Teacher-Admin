import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Teacher } from "../models/teachers.models.js";

const generateAccessAndRefreshToken = async(userId) => {
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
      throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
};

const registerTeacher = asyncHandler(async(req, res)=>{
    const {name, email, employee_code, department, password} = req.body;
    // console.log('req: ', req);
    

    if([name, email, employee_code, department, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields is required");
    }

    const existedUser = await Teacher.findOne({
      $or: [{employee_code}, {email}]
    });

    if(existedUser){
      throw new ApiError(400, "User with email or employee code already exists")
    }

    console.log("request: ",req.file);
    
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if(!avatar){
        throw new ApiError(400, "No avatar file found");
    }

    const teacher = await Teacher.create({
      name,
      email,
      employee_code,
      department,
      avatar: avatar.url,
      password
    })

    const createTeacher = await Teacher.findById(teacher._id).select("-password -refreshToken")

    if(!createTeacher){
      throw new ApiError(500, "Something went wrong while registering the user")
    }

    const { teacherAccessToken, teacherRefreshToken } = await generateAccessAndRefreshToken(teacher._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("teacherAccessToken", teacherAccessToken, options)
      .cookie("teacherRefreshToken", teacherRefreshToken, options)
      .json(new ApiResponse(200, 
        {
        teacher: createTeacher, teacherAccessToken, teacherRefreshToken
        }
      , "Teacher successfully registered"));
})

const loginTeacher = asyncHandler(async(req, res)=>{

  console.log("request : ", req);
  console.log("request's body : ", req.body);
  const {email, password} = req.body;

  //this logic is to check if the name or the email is correct, we cant write it this way : !name || !email
  if(!email){
      throw new ApiError (400, "email is required")
  }

  //this is used to find anyone from the database, by checking the name or email, whichever matches will return
  const user = await Teacher.findOne({email})

  //if we didnot get anything then return that user DNE
  if(!user){
      throw new ApiError(404, "User does not exist")
  }

  // we are not using 'User' rather we will use 'user' which is returned above, because 'User' is an instance of the moongoose of mongoDB and user is the data returned from the data base which signifies a single user and user.models.js file contain all the methods which can be accessed here such as isPasswordCorrect or refreshToken or accessToken
  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
      throw new ApiError(401, "Password is incorrect")
  }

  const {teacherAccessToken, teacherRefreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await Teacher.findById(user._id).select("-password -refreshToken")

  //now we will be adding functionality to return cookies, and for doing that securely such that the frontend could access those cookies but cannot modify them and also the cookies can only be modified using the backend server
  const options = {
    httpOnly: true,
    secure: true,
  }

  // cookie("accessToken", accessToken, options) this is the way of generating 
  return res
  .status(200)
  .cookie("teacherAccessToken", teacherAccessToken, options)
  .cookie("teacherRefreshToken", teacherRefreshToken, options)
  .json(
      new ApiResponse(
          200,
          {
              user: loggedInUser, teacherAccessToken, teacherRefreshToken
          },
          "User Logged In Successfully"
      )
  )

}) 

const logoutTeacher = asyncHandler(async(req, res)=>{
  await Teacher.findByIdAndUpdate(
    req.teacher._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset:{
        teacherRefreshToken: 1 // this removes the field from the document
      }
    },
    {
      new: true
    }
  )
  
  const options = {
    httpOnly: true,
    secure: true
  }
  
  return res.status(200).clearCookie("studentAccessToken", options).clearCookie("studentRefreshToken", options).json(new ApiResponse(200, {}, "User logged out"))
})

const getCurrentTeacher = asyncHandler(async (req, res)=>{
    return res.status(200).json(new ApiResponse(200, req.teacher, "current user fetched successfully"))
})//worked on postman
  
const updateAccountDetails = asyncHandler(async (req, res)=>{
    console.log("req.body of update account details: ",req.body);
    const {name, department, email, employee_code} = req.body;
  
    if(!name || !department || !email || !employee_code){
      throw new ApiError(400, "All field are requires")
    }
  
    console.log("req.teacher: ", req.teacher);
    console.log("req.teacher._id: ", req.teacher?._id);

    const teacher = await Teacher.findByIdAndUpdate(
      req.teacher?._id,
      {
        $set: {
          name, email, employee_code, department
        }
      },
      {new: true} // this returns all the values after the fields are updated
    ).select("-password")

    console.log("teacher: ", teacher);
  
    return res.status(200).json(new ApiResponse(200, teacher, "Account details updated successfully"))
})
  
//todo: delete the previous avatar image from the db and cloudinary
const updateTeacherAvatar = asyncHandler(async (req, res)=>{
    const avatarLocalPath = req.file?.path // we are taking the file from multer middleware, also here we are only taking one file as input and therefore we are using 'file', whereas if we wanted to take multiple file we would have written 'files' instead of 'file'
  
    if(!avatarLocalPath){
      throw new ApiError(400, "Avatar is missing")
    }
  
    const avatar = await uploadOnCloudinary(avatarLocalPath)
  
    if(!avatar.url){
      throw new ApiError(400, "Error while uploading on avatar")
    }
  
    const teacher = await Teacher.findByIdAndUpdate(
      req.teacher?._id,
      {
        $set:{
          avatar: avatar.url
        }
      },
      {new: true}
    ).select("-password")
  
    return res.status(200).json(new ApiResponse(200, teacher, "avatar image updated successfully"));
  
})

export {registerTeacher, loginTeacher, logoutTeacher, getCurrentTeacher, updateTeacherAvatar, updateAccountDetails}

// _id
// 67168d450673dee0de3c03eb
// name
// "Dr. Aditi Sharma"
// email
// "aditi.sharma@university.edu"
// employee_code
// "EMP1001"
// department
// "Computer Science"
// avatar
// "https://example.com/avatars/aditi.png"