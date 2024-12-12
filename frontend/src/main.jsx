
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './Layouts/Layout';
import FacultyLayout from './Layouts/FacultyLayout'; // Import FacultyLayout
import AdminLayout from './Layouts/AdminLayout'; // Import AdminLayout
import Home from './pages/Home/Home';
import StudentPortal from './pages/StudentPortal/StudentPortal';
import ConductedTable from './table/Seminars/ConductedSeminars/ConductedMain';
import ConductedMain from './table/Seminars/ConductedSeminars/ConductedMain';
import UpcomingSeminars from './pages/UpcomingSeminars/UpcomingSeminars';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import EditFacultyProfile from './pages/FacultyPortal/FacultyList/EditFacultyProfile';
import FacultySISU from './pages/SISU/FacultySISU';
import AdminSISU from './pages/SISU/AdminSISU';
import StudentSISU from './pages/SISU/StudentSISU';
import FacultyCards from './pages/AdminPortal/AdminList/FacultyCards';
import StudentHome from './pages/StudentPortal/StudentHome';
import AdminHome from './pages/AdminPortal/AdminList/AdminHome';
import RouteTransitionWrapper from './Animations/RouteTransitionWrapper';
import { AnimatePresence, motion } from "framer-motion";
import LectureCards from './pages/StudentPortal/LectureCards';
import UpcomingRsvp from './pages/StudentPortal/UpcomingRsvp';
import SeminarCards from './pages/StudentPortal/SeminarCards';
import StudentLayout from './Layouts/StudentLayout';
import LectureFeedback from './pages/AdminPortal/AdminList/LectureFeedback';
import BasicForm from './Forms/Student/BasicForm';
import AdminEditProfile from './components/EditProfile/AdminEditProfile';
import StudentEditProfile from './components/EditProfile/StudentEditProfile';
import AdminLecturesTable from './table/Tables/Admin/AdminLecturesTable';
// import LecturesTable from './table/Tables/LecturesTable';
import AdminEventTable from './table/Tables/Admin/AdminEventTable';
import AdminSeminarsTable from './table/Tables/Admin/AdminSeminarsTable';
import AdminProjectTable from './table/Tables/Admin/AdminsProjectTable';
import AdminStudentsGuidedTable from './table/Tables/Admin/AdminStudentsGuidedTable';
import AdminResearchTable from './table/Tables/Admin/AdminResearchTable';
import FacultyResearchTable from './table/Tables/Faculty/FacultyResearchTable';
import FacultyLecturesTable from './table/Tables/Faculty/FacultyLecturesTable';
import FacultySTTPTable from './table/Tables/Faculty/FacultySTTPTable';
import FacultyEventTable from './table/Tables/Faculty/FacultyEventTable';
import FacultySeminarsTable from './table/Tables/Faculty/FacultySeminarsConductedTable';
import FacultyProjectTable from './table/Tables/Faculty/FacultyProjectTable';
import FacultyGuidedTable from './table/Tables/Faculty/FacultyGuidedTable';
import FacultyDataDashboard from './pages/FacultyPortal/FacultyDataDashboard';
import PostsPage from './pages/FacultyPortal/PostsPage';
import FacultyTeachingProcessTable from './table/Tables/Faculty/FacultyTeachingProcess';
import AdminHomeLayout from './Layouts/AdminHomeLayout';
import AdminReleaseFeedbacks from './pages/AdminPortal/AdminList/AdminFeedbacks';
import AdminLectureAllocationPage from './pages/AdminPortal/AdminList/AdminLectureAllocation';


import { FontSizeProvider } from './components/Ribbon/FontSizeContext';
import FontSizeHandler from './components/Ribbon/FontSizeHandler';
import ResearchLayout from './Layouts/ResearchLayout';
import ReleaseFeedbacks from './pages/AdminPortal/AdminList/AdminFeedbacks';
import AdminLectureAllocationTable from './table/Tables/Admin/AdminLectureAllocationTable';
import AppraisalReport from './pages/FacultyAppraisalReport';
import FacultyRegister from './pages/SISU/FacultyRegister';
import StudentRegister from './pages/SISU/StudentRegister';
import AdminAllocateSubjectToStudent from './pages/AdminPortal/AdminList/AdminAllocateSubjectToStudents';
import AddLecMarkAttendabce from './table/Tables/Faculty/AddLecMarkAttendabce';
import PeerReview from './pages/FacultyPortal/PeerReview';
import SubjectList from './table/Tables/Faculty/SubjectList';
import LectureAndAttendance from './table/Tables/Faculty/LectureAndAttendance';
import AdminFacultyAppraisalReport from './table/Tables/Admin/AdminFacultyAppraisalReport';
import AdminSTTPTable from './table/Tables/Admin/AdminSTTPTable';
import SeminarLayout from './Layouts/SeminarLayout';
import AdminPointAllocationLayout from './Layouts/AdminPointAllocationLayout';
import FacultyCourseTable from './table/Tables/FacultyCourseTable';
import FacultyAppraisalReport from './pages/FacultyAppraisalReport';
import FacultyPointAllocationLayout from './Layouts/FacultyPointAllocationLayout';
import AdminSeminarLayout from './Layouts/AdminSeminarLayouy';
import FacultyInfoCard from './pages/FacultyPortal/FacultyList/FacultyInfoCard';
import AdminPostsPage from './pages/AdminPortal/AdminList/AdminPostsPage';
import AdminHodData from './pages/AdminPortal/AdminList/AdminHodData';
import FacultyResearchTable2 from './table/Tables/Admin/FacultyResearchTable2';
import HODAppraisalLayout from './Layouts/HODAppraisalLayout';
import HODTaskDistributionLayout from './Layouts/HODTaskDistributionLayout';
import WeightageDistributionLayout from './Layouts/WeightageDistributionLayout';
import FacultyAppraisalRankingTable from './table/Tables/FacultyAppraisalRankingTable';


const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} /> {/* Render Home on the root path */}
      <Route path="font-size-handler" element={<FontSizeHandler />} />




      <Route path="/faculty/:id" element={<FacultyLayout />}>
       <Route  index element={<RouteTransitionWrapper><FacultyAppraisalReport/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
    
        {/* <Route path="contribution" element={<RouteTransitionWrapper><FacultyDataDashboard/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} /> */}
        <Route path="subject/:subjectId" element={<RouteTransitionWrapper><LectureAndAttendance /></RouteTransitionWrapper>}  errorElement={<NotFoundPage />}/>
        <Route path="teaching-process" element={<RouteTransitionWrapper><FacultyCourseTable/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="research-papers" element={<RouteTransitionWrapper><ResearchLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="expert-lectures" element={<RouteTransitionWrapper><FacultyLecturesTable /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  />
        <Route path="sttp-conducted" element={<RouteTransitionWrapper><FacultySTTPTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<RouteTransitionWrapper><FacultyGuidedTable /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  />
        <Route path="seminars" element={<RouteTransitionWrapper><SeminarLayout /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  >
         <Route path="upcoming" element={<RouteTransitionWrapper><UpcomingSeminars /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} /> 
        </Route>
        <Route path="projects" element={<RouteTransitionWrapper><FacultyProjectTable /></RouteTransitionWrapper>} />
        <Route path="event-participation" element={<RouteTransitionWrapper><FacultyEventTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage />} />
        <Route path="posts" element={<RouteTransitionWrapper><PostsPage/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="appraisal-report" element={<RouteTransitionWrapper><AppraisalReport/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        {/* <Route path="peer-review" element={<RouteTransitionWrapper><PeerReview/></RouteTransitionWrapper>}errorElement={<NotFoundPage/>} /> */}

        <Route path="lecAttend" element={<RouteTransitionWrapper><SubjectList/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />

        <Route path="faculty-points" element={<RouteTransitionWrapper><FacultyPointAllocationLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        {/* <Route path="teacheraddecture" element={<RouteTransitionWrapper><AddLecMarkAttendabce/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} /> */}

      </Route>

      <Route path="faculty/edit-profile" element={<EditFacultyProfile/>} /> {/* Add Edit Profile route */}
      <Route path="admin/edit-profile" element={<AdminEditProfile/>} /> {/* Add Edit Profile route */}
      <Route path="student/edit-profile" element={<StudentEditProfile/>} /> {/* Add Edit Profile route */}


      {/* Sign-Up and Login Pages */}
      <Route path="faculty-sign-up" element={<FacultySISU/>} />
      <Route path="admin-sign-up" element={<AdminSISU/>} />
      <Route path="student-sign-up" element={<StudentSISU/>} />


      {/* AdminHodData */}
    
    <Route path="admin" element={<AdminHomeLayout/>} errorElement={<NotFoundPage/>}>
    <Route  index element={<AdminHome/>} errorElement={<NotFoundPage/>}/>
    <Route path="faculty-data" element={ <RouteTransitionWrapper><AdminHome/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="hod-data" element={<RouteTransitionWrapper><HODAppraisalLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>

    <Route path="allocate-lectures" element={<RouteTransitionWrapper><AdminLectureAllocationPage/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="release-feedbacks" element={<RouteTransitionWrapper><ReleaseFeedbacks/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="register-faulty" element={<RouteTransitionWrapper><FacultyRegister/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="register-student" element={<RouteTransitionWrapper><StudentRegister/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="allocate-sub-student" element={<RouteTransitionWrapper><AdminAllocateSubjectToStudent/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="appraisal-points" element={<RouteTransitionWrapper><AdminPointAllocationLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
    <Route path="assign-tasks" element={<RouteTransitionWrapper><HODTaskDistributionLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>}/>
<Route path="weightage-distribution" element={<RouteTransitionWrapper><WeightageDistributionLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />

<Route path="appraisal-ranking" element={<RouteTransitionWrapper><FacultyAppraisalRankingTable/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />

    </Route>
 
      <Route path="admin-info/:id" element={<AdminLayout/>}> 
        
        <Route path="facultyList" element={<FacultyCards/>}/>
        <Route path="admin-teacher-appraisal" index element={<RouteTransitionWrapper><AdminFacultyAppraisalReport/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />

        <Route path="personal-details" element={<FacultyInfoCard />} errorElement={<NotFoundPage/>} />
        <Route path="research-papers" element={<RouteTransitionWrapper><AdminResearchTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<RouteTransitionWrapper><AdminStudentsGuidedTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="expert-lecture" element={<RouteTransitionWrapper><AdminLecturesTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="event-participation" element={<RouteTransitionWrapper><AdminEventTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="contribution-achievement" element={<RouteTransitionWrapper><AdminPostsPage /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="seminars" element={<RouteTransitionWrapper><AdminSeminarLayout/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="sttp-conducted" element={<RouteTransitionWrapper><AdminSTTPTable/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="projects" element={<RouteTransitionWrapper><AdminProjectTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="adminallocate-lectures" element={<RouteTransitionWrapper><AdminLectureAllocationTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="admin-teacher-appraisal" element={<RouteTransitionWrapper><AdminFacultyAppraisalReport /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />

        {/* <Route path="Contribution-graph" element={<ResearchTable />} errorElement={<NotFoundPage/>} /> */}


      </Route>
       
      
      <Route path="student-home" element={<StudentHome />} /> {/* Route for student portal */}
      <Route path="student" element={<RouteTransitionWrapper><StudentLayout/></RouteTransitionWrapper>}>
      <Route path="lecture" element={<RouteTransitionWrapper><LectureCards/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
      {/* <Route path="upcoming-rsvp" element={< UpcomingRsvp/>} errorElement={<NotFoundPage/>} /> */}
      <Route path="seminar" element={<RouteTransitionWrapper><SeminarCards /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <FontSizeProvider>
  <RouterProvider router={router} />
  </FontSizeProvider>
);