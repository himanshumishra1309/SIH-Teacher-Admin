import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Admin } from "../models/admins.models.js";
import { Teacher } from "../models/teachers.models.js";
import { LectureFeedback } from "../models/lectureFeedbacks.models.js";
import { AllocatedSubject } from "../models/allocated-subjects.models.js";
import { ResearchPaper } from "../models/research-papers.models.js";
import { EventParticipation } from "../models/events-participated.models.js";
import { STTP } from "../models/sttp.models.js";
import { StudentGuided } from "../models/students-guided.models.js";
import { Project } from "../models/projects.models.js";
import { Seminar } from "../models/seminars.models.js";
import { SeminarFeedback } from "../models/feedback-seminars.models.js";
import { SeminarRSVP } from "../models/rsvp-seminar.models.js";
import { Lecture } from "../models/lectures.models.js";
import { ExpertLecture } from "../models/expert-lectures.models.js";

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const admin = Admin.findById(userId);
        const adminAccessToken = admin.generateAccessToken();
        const adminRefreshToken = admin.generateRefreshToken();

        admin.adminRefreshToken = adminRefreshToken

        await user.save({ validateBeforeSave: false }); // this is inbuilt in mongoDB to save the info, but there is one problem with this thing and that it will invoke the password field and to stop that we put an object and make it false the thing that we put in the object is validateBeforeSave

        return {adminRefreshToken, adminAccessToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerAdmin = asyncHandler(async(req, res)=>{
    const {name, email, designation, password} = req.body;

    if([name, email, designation, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields is required");
    }

    const existedUser = await Admin.findOne({email});

    if(existedUser){
        throw new ApiError(400, "User with email already exists")
    }

    console.log("request: ",req.file);
    
    const avatarLocalPath = req.file?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if(!avatar){
        throw new ApiError(400, "No avatar file found");
    }

    const admin = Admin.create({
        name,
        email,
        designation,
        avatar: avatar.url,
        password
    })

    const createAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    if(!createAdmin){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(200).json(new ApiResponse(200, createAdmin, "Admin successfully registered"));
});

const loginAdmin = asyncHandler(async(req, res)=>{
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
  const {email, password} = req.body;

  //this logic is to check if the name or the email is correct, we cant write it this way : !name || !email
  if(!email){
      throw new ApiError (400, "email is required")
  }

  //this is used to find anyone from the database, by checking the name or email, whichever matches will return
  const user = await Admin.findOne({email})

  //if we didnot get anything then return that user DNE
  if(!user){
      throw new ApiError(404, "User does not exist")
  }

  // we are not using 'User' rather we will use 'user' which is returned above, because 'User' is an instance of the moongoose of mongoDB and user is the data returned from the data base which signifies a single user and user.models.js file contain all the methods which can be accessed here such as isPasswordCorrect or refreshToken or accessToken
  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
      throw new ApiError(401, "Password is incorrect")
  }

  const {adminAccessToken, adminRefreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await Student.findById(user._id).select("-password -refreshToken")

  //now we will be adding functionality to return cookies, and for doing that securely such that the frontend could access those cookies but cannot modify them and also the cookies can only be modified using the backend server
  const options = {
    httpOnly: true,
    secure: true,
  }

  // cookie("accessToken", accessToken, options) this is the way of generating 
  return res
  .status(200)
  .cookie("adminAccessToken", adminAccessToken, options)
  .cookie("adminRefreshToken", adminRefreshToken, options)
  .json(
      new ApiResponse(
          200,
          {
              user: loggedInUser, adminAccessToken, adminRefreshToken
          },
          "User Logged In Successfully"
      )
  )

});

const logoutAdmin = asyncHandler(async(req, res)=>{
  Admin.findByIdAndUpdate(
    req.user._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset:{
        adminRefreshToken: 1 // this removes the field from the document
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
});

const getCurrentAdmin = asyncHandler(async (req, res)=>{
    return res.status(200).json(new ApiResponse(200, req.user, "current user fetched successfully"))
});
  
const updateAccountDetails = asyncHandler(async (req, res)=>{
    console.log("req.body of update account details: ",req.body);
    const {name, designation, email, password} = req.body;
  
    if(!name || !designation || !email || !password){
      throw new ApiError(400, "All field are requires")
    }
  
    const admin = Admin.findByIdAndUpdate(
      req.admin?._id,
      {
        $set: {
          name, designation, email, password
        }
      },
      {new: true} // this returns all the values after the fields are updated
    ).select("-password")
  
    return res.status(200).json(new ApiResponse(200, admin, "Account details updated successfully"))
});
  
//todo: delete the previous avatar image from the db and cloudinary
const updateAdminAvatar = asyncHandler(async (req, res)=>{
    const avatarLocalPath = req.file?.path // we are taking the file from multer middleware, also here we are only taking one file as input and therefore we are using 'file', whereas if we wanted to take multiple file we would have written 'files' instead of 'file'
  
    if(!avatarLocalPath){
      throw new ApiError(400, "Avatar is missing")
    }
  
    const avatar = await uploadOnCloudinary(avatarLocalPath)
  
    if(!avatar.url){
      throw new ApiError(400, "Error while uploading on avatar")
    }
  
    const user = await Admin.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          avatar: avatar.url
        }
      },
      {new: true}
    ).select("-password")
  
    return res.status(200).json(new ApiResponse(200, user, "avatar image updated successfully"));
  
})

/**
 * Controller to fetch all teachers with optional search, pagination, and sorting.
 * Accessible only by authenticated admins.
*/
const getAllTheTeachers = asyncHandler(async (req, res) => {
  // Extract query parameters for searching, pagination, and sorting
  const { 
    name, 
    email, 
    department, 
    employee_code,  // New search parameter for employee_code
    avatar,
    page = 1, 
    limit = 10, 
    sortBy = 'name', 
    order = 'asc' 
  } = req.query;

  // Build the search filter object
  let filter = {};

  if (name) {
    // Case-insensitive partial match for name
    filter.name = { $regex: name, $options: 'i' };
  }

  if (email) {
    // Case-insensitive partial match for email
    filter.email = { $regex: email, $options: 'i' };
  }

  if (department) {
    // Case-insensitive partial match for department
    filter.department = { $regex: department, $options: 'i' };
  }

  if (employee_code) {
    // Case-insensitive partial match for employee_code
    filter.employee_code = { $regex: employee_code, $options: 'i' };
  }

  // Determine sort order
  const sortOrder = order === 'desc' ? -1 : 1;

  // Execute the query with search, pagination, and sorting
  const teachers = await Teacher.find(filter)
    .select("-password -refreshToken") // Exclude sensitive fields
    .sort({ [sortBy]: sortOrder })    // Sort based on query params
    .limit(parseInt(limit))           // Limit number of results
    .skip((parseInt(page) - 1) * parseInt(limit)) // Skip for pagination
    .exec();

  // Get total count for pagination
  const total = await Teacher.countDocuments(filter);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Prepare the response data
  const responseData = {
    teachers,
    pagination: {
      total,
      totalPages,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
    },
  };

  // Return the response
  return res.status(200).json(
    new ApiResponse(200, responseData, "All teachers fetched successfully")
  );
});


/**
 * Controller to fetch personal information of a specific teacher, including their subjects.
 * Accessible only by authenticated admins.
*/
const getTeacherPersonalInfo = asyncHandler(async (req, res) => {
  // Step 1: Extract teacherId from request parameters
  const { teacherId } = req.params;

  // Validate teacherId as a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  // Step 2: Fetch teacher's personal information
  const teacher = await Teacher.findById(teacherId)
    .select("avatar name department employee_code email")
    .lean(); // Use lean() for plain JavaScript objects

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  // Step 3: Fetch subjects taught by the teacher
  const subjects = await AllocatedSubject.find({ owner: teacherId })
    .select("subject_name subject_code subject_credit branch year")
    .lean();

  // Include the AllocatedSubject's _id for feedback retrieval
  const subjectsWithId = subjects.map(subject => ({
    _id: subject._id,
    subject_name: subject.subject_name,
    subject_code: subject.subject_code,
    subject_credit: subject.subject_credit,
    branch: subject.branch,
    year: subject.year
  }));

  // Step 4: Construct the response data
  const responseData = {
    teacher: {
      avatar: teacher.avatar,
      name: teacher.name,
      department: teacher.department,
      employee_code: teacher.employee_code,
      email: teacher.email
    },
    subjects: subjectsWithId
  };

  // Step 5: Send the response
  return res.status(200).json(
    new ApiResponse(200, responseData, "Teacher personal info fetched successfully.")
  );
});


/**
 * Controller to fetch feedbacks for a specific subject taught by a teacher.
 * Accessible only by authenticated admins.
*/
const getSubjectFeedbacks = asyncHandler(async (req, res) => {
  // Step 1: Extract teacherId and subjectId from request parameters
  const { teacherId, subjectId } = req.params;

  // Validate teacherId and subjectId as valid MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new ApiError(400, "Invalid subject ID format.");
  }

  // Step 2: Verify the subject belongs to the teacher
  const subject = await AllocatedSubject.findOne({
    _id: subjectId,
    owner: teacherId
  }).lean();

  if (!subject) {
    throw new ApiError(404, "Subject not found for this teacher.");
  }

  // Step 3: Fetch feedbacks matching subject details
  const feedbacks = await LectureFeedback.find({
    subject_name: subject.subject_name,
    subject_code: subject.subject_code,
    subject_credit: subject.subject_credit,
    branch: subject.branch,
    year: subject.year
  })
    .populate('owner', 'name branch year') // Include student details
    .select("rating comment owner") // Select required fields
    .lean();

  if (!feedbacks || feedbacks.length === 0) {
    throw new ApiError(404, "No feedback found for this subject.");
  }

  // Step 4: Construct response data
  const feedbackList = feedbacks.map(feedback => ({
    rating: feedback.rating,
    comment: feedback.comment,
  }));

  // Step 5: Send the response
  return res.status(200).json(
    new ApiResponse(200, feedbackList, "Feedbacks fetched successfully.")
  );
});


const getResearchPapersPublishedByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const researchPapers = await ResearchPaper.find({owner: teacherId})
    .select("name publication publishedDate viewUrl")
    .lean();

  if(!researchPapers || researchPapers.length === 0){
    throw new ApiError(404, "No research papers found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, researchPapers, "Research papers fetched successfully.")
  );
});

const getEventsParticipatedByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const eventsParticipated = await EventParticipation.find({owner: teacherId})
    .select("role event date report")
    .lean();

  if(!eventsParticipated || eventsParticipated.length === 0){
    throw new ApiError(404, "No events participated found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, eventsParticipated, "Events participated fetched successfully.")
  );
});

const getExpertLecturesDeliveredByTheTeacher = asyncHandler(async (req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const expertLectures = await ExpertLecture.find({owner: teacherId}).select("topic duration date report").lean();

  if(!expertLectures || expertLectures.length === 0){
    throw new ApiError(404, "No expert lectures delivered found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, expertLectures, "Expert lectures delivered fetched successfully.")
  );
});

const getSTTPConductedByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const sttps = await STTP.find({owner: teacherId})
    .select("topic duration startDate endDate venue report")
    .lean();
  
  if(!sttps || sttps.length === 0){
    throw new ApiError(404, "No STTPs conducted found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, sttps, "STTPs conducted fetched successfully.")
  );
});

const getMtechStudentsGuidedByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const mtechStudentsGuided = await StudentGuided.find({owner: teacherId, mOp: "M.Tech"})
    .select("topic student_name roll_no branch academic_year")
    .lean();

  if(!mtechStudentsGuided || mtechStudentsGuided.length === 0){
    throw new ApiError(404, "No M.Tech students guided found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, mtechStudentsGuided, "M.Tech students guided fetched successfully.")
  );
});

const getPhdStudentsGuidedByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const phdStudentsGuided = await StudentGuided.find({owner: teacherId, mOp: "Ph.D"})
    .select("topic student_name roll_no branch academic_year")
    .lean();

  if(!phdStudentsGuided || phdStudentsGuided.length === 0){
    throw new ApiError(404, "No Ph.D students guided found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, phdStudentsGuided, "Ph.D students guided fetched successfully.")
  );
});

const getProjectsHeldByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const projects = await Project.find({owner: teacherId})
    .select("topic branch_name daily_duration startDate endDate report")
    .lean();

  if(!projects || projects.length === 0){
    throw new ApiError(404, "No projects held found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, projects, "Projects held fetched successfully.")
  );
});

const getSeminarsConductedByTheTeacher = asyncHandler(async(req ,res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const seminars = await Seminar.find({owner: teacherId, status: "conducted"})
    .select("topic duration date report")
    .lean();

  if(!seminars || seminars.length === 0){
    throw new ApiError(404, "No seminars conducted found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, seminars, "Seminars conducted fetched successfully.")
  );
});

const getUpcomingSeminarByTheTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  const seminars = await Seminar.find({ owner: teacherId, status: "upcoming" })
    .select("topic duration date")
    .lean();

  if (!seminars || seminars.length === 0) {
    throw new ApiError(404, "No upcoming seminars found for this teacher.");
  }

  // Fetch the RSVP count for each seminar
  const seminarDetailsWithRSVP = await Promise.all(
    seminars.map(async (seminar) => {
      const rsvpCount = await SeminarRSVP.countDocuments({ seminar: seminar._id });
      return {
        ...seminar,
        rsvpCount,
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, seminarDetailsWithRSVP, "Upcoming seminars fetched successfully with RSVP count.")
  );
});

const getConductedSeminarFeedbacks = asyncHandler(async(req, res)=>{
  const {teacherId, seminarId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }

  if(!mongoose.Types.ObjectId.isValid(seminarId)){
    throw new ApiError(400, "Invalid seminar ID format.");
  }

  const feedbacks = await SeminarFeedback.findById({seminar: seminarId}).select("rating comment").lean();

  if(!feedbacks || feedbacks.length === 0){
    throw new ApiError(404, "No feedbacks found for this seminar.");
  }

  return res.status(200).json(
    new ApiResponse(200, feedbacks, "Feedbacks fetched successfully.")
  );
});

const getLecturesConductedByTheTeacher = asyncHandler(async(req, res)=>{
  const {teacherId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(teacherId)){
    throw new ApiError(400, "Invalid teacher ID format.");
  }
  
  const lectures = await Lecture.find({owner: teacherId}).select("topic duration date").lean();

  if(!lectures || lectures.length === 0){
    throw new ApiError(404, "No lectures conducted found for this teacher.");
  }

  return res.status(200).json(
    new ApiResponse(200, lectures, "Lectures conducted fetched successfully.")
  );
});



export {registerAdmin, loginAdmin, logoutAdmin, getCurrentAdmin, updateAdminAvatar, updateAccountDetails, getAllTheTeachers, getTeacherPersonalInfo, getSubjectFeedbacks, getResearchPapersPublishedByTheTeacher, getEventsParticipatedByTheTeacher, getExpertLecturesDeliveredByTheTeacher, getSTTPConductedByTheTeacher, getMtechStudentsGuidedByTheTeacher, getPhdStudentsGuidedByTheTeacher, getProjectsHeldByTheTeacher, getSeminarsConductedByTheTeacher, getUpcomingSeminarByTheTeacher, getConductedSeminarFeedbacks, getLecturesConductedByTheTeacher}