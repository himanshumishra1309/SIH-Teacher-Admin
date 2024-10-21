
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './Layouts/Layout';
import FacultyLayout from './Layouts/FacultyLayout'; // Import FacultyLayout
import AdminLayout from './Layouts/AdminLayout'; // Import AdminLayout
import Home from './pages/Home/Home';
import AdminPortal from './pages/AdminPortal/AdminList/AdminHomeList'; // This can be the main admin page
import StudentPortal from './pages/StudentPortal/StudentPortal';
import BasicTable from './table/Research/BasicTable';
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






const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} /> {/* Render Home on the root path */}

      <Route path="faculty" element={<FacultyLayout />}>
        {/* <Route index element={<BasicTable />} /> Default to BasicTable */}
        <Route index element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="research-papers" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="expert-lectures" element={<BasicTable />}errorElement={<NotFoundPage/>}  />
        <Route path="sttp-conducted" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="institute-portfolio" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="department-portfolio" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<RouteTransitionWrapper><BasicTable /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  />
        <Route path="seminars" element={<RouteTransitionWrapper><ConductedMain /></RouteTransitionWrapper>}errorElement={<NotFoundPage/>}  >
           <Route path="upcoming" element={<RouteTransitionWrapper><UpcomingSeminars /></RouteTransitionWrapper>} errorElement={<NotFoundPage/>} /> 
        </Route>
        <Route path="projects" element={<BasicTable />} />
        <Route path="lectures" element={<BasicTable />} />
        <Route path="event-participation" errorElement={<NotFoundPage />} />


      </Route>

      <Route path="faculty/edit-profile" element={<EditFacultyProfile/>} /> {/* Add Edit Profile route */}
      <Route path="admin/edit-profile" element={<AdminEditProfile/>} /> {/* Add Edit Profile route */}

      <Route path="student/edit-profile" element={<StudentEditProfile/>} /> {/* Add Edit Profile route */}




      {/* Sign-Up and Login Pages */}
      <Route path="faculty-sign-up" element={<FacultySISU/>} />
      <Route path="admin-sign-up" element={<AdminSISU/>} />
      <Route path="student-sign-up" element={<StudentSISU/>} />


    
      <Route path="admin-home" element={<AdminHome/>} />

 
      <Route path="admin-info" element={<AdminLayout/>}> 

        <Route path="facultyList" element={<FacultyCards/>}/>
        <Route path="personal-details" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="research-papers" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="institute-portfolio" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="department-portfolio" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="expert-lecture" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="event-participation" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="seminars" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="projects" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="Contribution-graph" element={<BasicTable />} errorElement={<NotFoundPage/>} />

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
<RouterProvider router={router} />
);