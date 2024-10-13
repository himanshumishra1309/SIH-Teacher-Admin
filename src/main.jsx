
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
import EditFacultyProfile from './pages/FacultyList/EditFacultyProfile';
import FacultySISU from './pages/SISU/FacultySISU';
import AdminSISU from './pages/SISU/AdminSISU';
import StudentSISU from './pages/SISU/StudentSISU';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} /> {/* Render Home on the root path */}

      <Route path="faculty" element={<FacultyLayout />}>
      {/* Redirect to faculty/1 by default */}
        {/* <Route index element={<BasicTable />} /> Default to BasicTable */}
        <Route path="research-papers" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="expert-lectures" element={<BasicTable />}errorElement={<NotFoundPage/>}  />
        <Route path="sttp-conducted" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="institute-portfolio" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="department-portfolio" element={<BasicTable />} errorElement={<NotFoundPage/>} />
        <Route path="students-guided" element={<BasicTable />}errorElement={<NotFoundPage/>}  />
        <Route path="seminars" element={<ConductedMain />}errorElement={<NotFoundPage/>}  >
           <Route path="upcoming" element={<UpcomingSeminars />} errorElement={<NotFoundPage/>} /> 
        </Route>

        
        <Route path="projects" element={<BasicTable />} />
        <Route path="lectures" element={<BasicTable />} />
        <Route path="event-participation" errorElement={<NotFoundPage />} />
      </Route>

      <Route path="faculty/:id/edit-profile" element={<EditFacultyProfile/>} /> {/* Add Edit Profile route */}


      {/* Sign-Up and Login Pages */}
      <Route path="faculty-sign-up" element={<FacultySISU/>} />
      <Route path="admin-sign-up" element={<AdminSISU/>} />
      <Route path="student-sign-up" element={<StudentSISU/>} />


    


      <Route path="admin" element={<AdminLayout />}> {/* Admin layout to wrap admin routes */}
        {/* You can add more admin-related routes here */}
      </Route>

      <Route path="student" element={<StudentPortal />} /> {/* Route for student portal */}

    </Route>
  )
);

createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

);