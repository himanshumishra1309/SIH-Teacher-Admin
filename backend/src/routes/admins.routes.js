// routes/admin.routes.js

import express from 'express';
import { 
  registerAdmin,
  registerTeacher,
  getCurrentTeacher,
  updateTeacherAccountDetails,
  updateTeacherAvatar,
  allotSubjectsToTeachers,
  viewAllAllocatedSubjectsOfTheTeacher,
  editAllocatedSubjectOfTheTeacher,
  deleteAllocatedSubjectOfTheTeacher,
  registerStudent,
  getCurrentStudent,
  updateStudentAccountDetails,
  updateStudentAvatar,
  allottSubjectsToStudents,
  viewAllSubjectsAllottedToTheStudent,
  editAllottedSubjectOfTheStudent,
  deleteAllottedSubjectOfTheStudent,
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

router.post('/register', upload.single("avatar"), registerAdmin);

router.post('/register-teacher', verifyAdminJWT, upload.single("avatar"), registerTeacher);

router.get('/teacher/:teacherId', verifyAdminJWT, getCurrentTeacher);

router.patch('/teacher/:teacherId/update', verifyAdminJWT, updateTeacherAccountDetails);

router.put('/teacher/:teacherId/avatar', verifyAdminJWT, upload.single('avatar'), updateTeacherAvatar);

router.post('/subjects/allocate', verifyAdminJWT, allotSubjectsToTeachers);

router.get('/teacher/:teacherId/allocated-subjects', verifyAdminJWT, viewAllAllocatedSubjectsOfTheTeacher);

router.put('/teacher/:teacherId/allocated-subject/:subjectId', verifyAdminJWT, editAllocatedSubjectOfTheTeacher);

router.delete('/teacher/:teacherId/allocated-subject/:subjectId', verifyAdminJWT, deleteAllocatedSubjectOfTheTeacher);

router.post('/register-student', verifyAdminJWT, upload.single('avatar'), registerStudent);

router.get('/student/:studentId', verifyAdminJWT, getCurrentStudent);

router.patch('/student/:studentId/update', verifyAdminJWT, updateStudentAccountDetails);

router.post('/login', loginAdmin);

router.post('/logout', verifyAdminJWT, logoutAdmin);

router.get('/me', verifyAdminJWT, getCurrentAdmin);

router.patch('/me/update', verifyAdminJWT, updateAccountDetails);

router.put('/me/avatar', 
  verifyAdminJWT, 
  upload.single('avatar'), 
  updateAdminAvatar
);

router.get('/teachers', verifyAdminJWT, getAllTheTeachers); // done

router.get('/teachers/:teacherId', verifyAdminJWT, getTeacherPersonalInfo); // done

router.get('/teachers/:teacherId/subjects/:subjectId/feedbacks', verifyAdminJWT, getSubjectFeedbacks);

router.get('/teachers/:teacherId/research-papers', verifyAdminJWT, getResearchPapersPublishedByTheTeacher); // done

router.get('/teachers/:teacherId/events-participated', verifyAdminJWT, getEventsParticipatedByTheTeacher); // done

router.get('/teachers/:teacherId/expert-lectures', verifyAdminJWT, getExpertLecturesDeliveredByTheTeacher); // done

router.get('/teachers/:teacherId/sttps', verifyAdminJWT, getSTTPConductedByTheTeacher); // done

router.get('/teachers/:teacherId/students-guided/mtech', verifyAdminJWT, getMtechStudentsGuidedByTheTeacher);  // done

router.get('/teachers/:teacherId/students-guided/phd', verifyAdminJWT, getPhdStudentsGuidedByTheTeacher); // done

router.get('/teachers/:teacherId/projects', verifyAdminJWT, getProjectsHeldByTheTeacher); // done

router.get('/teachers/:teacherId/seminars/conducted', verifyAdminJWT, getSeminarsConductedByTheTeacher); // done

router.get('/teachers/:teacherId/seminars/upcoming', verifyAdminJWT, getUpcomingSeminarByTheTeacher); // done

router.get('/teachers/:teacherId/seminars/:seminarId/feedbacks', verifyAdminJWT, getConductedSeminarFeedbacks); // error

router.get('/teachers/:teacherId/lectures', verifyAdminJWT, getLecturesConductedByTheTeacher);

export default router;
