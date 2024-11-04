// routes/admin.routes.js

import express from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  logoutAdmin, 
  getCurrentAdmin, 
  updateAccountDetails, 
  updateAdminAvatar, 
  getAllTheTeachers, 
  getTeacherPersonalInfo, 
  getSubjectFeedbacks, 
  getResearchPapersPublishedByTheTeacher, 
  getEventsParticipatedByTheTeacher, 
  getExpertLecturesDeliveredByTheTeacher, 
  getSTTPConductedByTheTeacher, 
  getMtechStudentsGuidedByTheTeacher, 
  getPhdStudentsGuidedByTheTeacher, 
  getProjectsHeldByTheTeacher, 
  getSeminarsConductedByTheTeacher, 
  getUpcomingSeminarByTheTeacher, 
  getConductedSeminarFeedbacks, 
  getLecturesConductedByTheTeacher 
} from '../controllers/admins.controllers.js'
import {verifyAdminJWT} from '../middleware/admin.auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

/**
 * @route   POST /admin/register
 * @desc    Register a new admin with avatar upload
 * @access  Public
 */
router.post('/register', 
  upload.fields([{ name: 'avatar', maxCount: 1 }]), 
  registerAdmin
);

/**
 * @route   POST /admin/login
 * @desc    Login admin
 * @access  Public
 */
router.post('/login', loginAdmin);

/**
 * @route   POST /admin/logout
 * @desc    Logout admin
 * @access  Protected
 */
router.post('/logout', verifyAdminJWT, logoutAdmin);

/**
 * @route   GET /admin/me
 * @desc    Get current logged-in admin's info
 * @access  Protected
 */
router.get('/me', verifyAdminJWT, getCurrentAdmin);

/**
 * @route   PATCH /admin/me/update
 * @desc    Update admin's account details
 * @access  Protected
 */
router.patch('/me/update', verifyAdminJWT, updateAccountDetails);

/**
 * @route   PUT /admin/me/avatar
 * @desc    Update admin's avatar
 * @access  Protected
 */
router.put('/me/avatar', 
  verifyAdminJWT, 
  upload.single('avatar'), 
  updateAdminAvatar
);

/**
 * @route   GET /admin/teachers
 * @desc    Fetch all teachers with optional search, pagination, and sorting
 * @access  Protected
 */
router.get('/teachers', verifyAdminJWT, getAllTheTeachers); // done

/**
 * @route   GET /admin/teachers/:teacherId
 * @desc    Fetch personal information of a specific teacher, including their subjects
 * @access  Protected
 */
router.get('/teachers/:teacherId', verifyAdminJWT, getTeacherPersonalInfo); // done

/**
 * @route   GET /admin/teachers/:teacherId/subjects/:subjectId/feedbacks
 * @desc    Fetch feedbacks for a specific subject taught by a teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/subjects/:subjectId/feedbacks', verifyAdminJWT, getSubjectFeedbacks);

/**
 * @route   GET /admin/teachers/:teacherId/research-papers
 * @desc    Fetch research papers published by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/research-papers', verifyAdminJWT, getResearchPapersPublishedByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/events-participated
 * @desc    Fetch events participated by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/events-participated', verifyAdminJWT, getEventsParticipatedByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/expert-lectures
 * @desc    Fetch expert lectures delivered by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/expert-lectures', verifyAdminJWT, getExpertLecturesDeliveredByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/sttps
 * @desc    Fetch STTPs conducted by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/sttps', verifyAdminJWT, getSTTPConductedByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/students-guided/mtech
 * @desc    Fetch M.Tech students guided by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/students-guided/mtech', verifyAdminJWT, getMtechStudentsGuidedByTheTeacher);  // done

/**
 * @route   GET /admin/teachers/:teacherId/students-guided/phd
 * @desc    Fetch Ph.D students guided by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/students-guided/phd', verifyAdminJWT, getPhdStudentsGuidedByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/projects
 * @desc    Fetch projects held by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/projects', verifyAdminJWT, getProjectsHeldByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/seminars/conducted
 * @desc    Fetch seminars conducted by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/seminars/conducted', verifyAdminJWT, getSeminarsConductedByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/seminars/upcoming
 * @desc    Fetch upcoming seminars by the teacher with RSVP count
 * @access  Protected
 */
router.get('/teachers/:teacherId/seminars/upcoming', verifyAdminJWT, getUpcomingSeminarByTheTeacher); // done

/**
 * @route   GET /admin/teachers/:teacherId/seminars/:seminarId/feedbacks
 * @desc    Fetch feedbacks for a conducted seminar by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/seminars/:seminarId/feedbacks', verifyAdminJWT, getConductedSeminarFeedbacks); // error

/**
 * @route   GET /admin/teachers/:teacherId/lectures
 * @desc    Fetch lectures conducted by the teacher
 * @access  Protected
 */
router.get('/teachers/:teacherId/lectures', verifyAdminJWT, getLecturesConductedByTheTeacher);

export default router;
