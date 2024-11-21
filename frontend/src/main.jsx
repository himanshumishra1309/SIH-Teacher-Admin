
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './Layouts/Layout';
import FacultyLayout from './Layouts/FacultyLayout'; // Import FacultyLayout
import AdminLayout from './Layouts/AdminLayout'; // Import AdminLayout
import Home from './pages/Home/Home';
import StudentPortal from './pages/StudentPortal/StudentPortal';
import ResearchTable from './table/Tables/ResearchTable';
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
import LecturesTable from './table/Tables/LecturesTable';
import AdminEventTable from './table/Tables/Admin/AdminEventTable';
import AdminSeminarsTable from './table/Tables/Admin/AdminSeminarsTable';
import AdminProjectTable from './table/Tables/Admin/AdminsProjectTable';
import AdminStudentsGuidedTable from './table/Tables/Admin/AdminStudentsGuidedTable';
import AdminResearchTable from './table/Tables/Admin/AdminResearchTable';
import FacultyResearchTable from './table/Tables/Faculty/FacultyResearchTable';
import FacultyLecturesTable from './table/Tables/Faculty/FacultyLecturesTable';
import FacultySTTPTable from './table/Tables/Faculty/FacultySTTPTable';
import FacultyEventTable from './table/Tables/Faculty/FacultyEventTable';
import FacultySeminarsTable from './table/Tables/Faculty/FacultySeminarsTable';
import FacultyProjectTable from './table/Tables/Faculty/FacultyProjectTable';
import FacultyGuidedTable from './table/Tables/Faculty/FacultyGuidedTable';
import FacultyDataDashboard from './pages/FacultyPortal/FacultyDataDashboard';
import PostsPage from './pages/FacultyPortal/PostsPage';
import FacultyTeachingProcessTable from './table/Tables/Faculty/FacultyTeachingProcess';
import { FontSizeProvider } from './components/Ribbon/FontSizeContext';
import FontSizeHandler from './components/Ribbon/FontSizeHandler';

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} /> {/* Render Home on the root path */}
      <Route path="font-size-handler" element={<FontSizeHandler />} />
      <Route path="/faculty/:id" element={<FacultyLayout />}>
        {/* <Route index element={<ResearchTable />} /> Default to ResearchTable */}
        <Route index element={<FacultyDataDashboard/>} errorElement={<NotFoundPage/>} />
        
        <Route path="contribution" element={<RouteTransitionWrapper><FacultyDataDashboard/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="teaching-process" element={<RouteTransitionWrapper><FacultyTeachingProcessTable/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="research-papers" element={<RouteTransitionWrapper><FacultyResearchTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="expert-lectures" element={<RouteTransitionWrapper><FacultyLecturesTable /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  />
        <Route path="sttp-conducted" element={<RouteTransitionWrapper><FacultySTTPTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />
        <Route path="institute-portfolio" element={<ResearchTable />} errorElement={<NotFoundPage/>} />
        <Route path="department-portfolio" element={<ResearchTable />} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<RouteTransitionWrapper><FacultyGuidedTable /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  />
        <Route path="seminars" element={<RouteTransitionWrapper><FacultySeminarsTable /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  >
           <Route path="upcoming" element={<RouteTransitionWrapper><UpcomingSeminars /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} /> 
        </Route>
        <Route path="projects" element={<RouteTransitionWrapper><FacultyProjectTable /></RouteTransitionWrapper>} />
        <Route path="lectures" element={<LecturesTable />} />
        <Route path="event-participation" element={<RouteTransitionWrapper><FacultyEventTable /></RouteTransitionWrapper>} errorElement={<NotFoundPage />} />
        <Route path="posts" element={<RouteTransitionWrapper><PostsPage/></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} />



      </Route>

      <Route path="faculty/edit-profile" element={<EditFacultyProfile/>} /> {/* Add Edit Profile route */}
      <Route path="admin/edit-profile" element={<AdminEditProfile/>} /> {/* Add Edit Profile route */}

      <Route path="student/edit-profile" element={<StudentEditProfile/>} /> {/* Add Edit Profile route */}

      {/* Sign-Up and Login Pages */}
      <Route path="faculty-sign-up" element={<FacultySISU/>} />
      <Route path="admin-sign-up" element={<AdminSISU/>} />
      <Route path="student-sign-up" element={<StudentSISU/>} />
    
      <Route path="admin-home" element={<AdminHome/>} />

 
      <Route path="admin-info/:id" element={<AdminLayout/>}> 

        <Route path="facultyList" element={<FacultyCards/>}/>
        {/* <Route index element={<AdminDataDashboard/>} errorElement={<NotFoundPage/>} /> */}
        <Route index element={<AdminResearchTable />} errorElement={<NotFoundPage/>} />

        <Route path="personal-details" element={<ResearchTable />} errorElement={<NotFoundPage/>} />
        <Route path="research-papers" element={<AdminResearchTable />} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<AdminStudentsGuidedTable />} errorElement={<NotFoundPage/>} />
        <Route path="institute-portfolio" element={<ResearchTable />} errorElement={<NotFoundPage/>} />
        <Route path="department-portfolio" element={<ResearchTable />} errorElement={<NotFoundPage/>} />
        <Route path="expert-lecture" element={<AdminLecturesTable />} errorElement={<NotFoundPage/>} />
        <Route path="event-participation" element={<AdminEventTable />} errorElement={<NotFoundPage/>} />
        <Route path="seminars" element={<AdminSeminarsTable/>} errorElement={<NotFoundPage/>} />
        <Route path="projects" element={<AdminProjectTable />} errorElement={<NotFoundPage/>} />
        <Route path="Contribution-graph" element={<ResearchTable />} errorElement={<NotFoundPage/>} />


      </Route>
      
      
      <Route path="student-home" element={<StudentHome />} /> {/* Route for student portal */}
    
      <Route path="student" element={<StudentLayout/>}>
      <Route path="lecture" element={<LectureCards/>} errorElement={<NotFoundPage/>} />
      <Route path="upcoming-Rsvp" element={< UpcomingRsvp/>} errorElement={<NotFoundPage/>} />
      <Route path="seminar" element={<SeminarCards />} errorElement={<NotFoundPage/>} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <FontSizeProvider>
  <RouterProvider router={router} />
  </FontSizeProvider>
);