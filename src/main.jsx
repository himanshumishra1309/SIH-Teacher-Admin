
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './Layouts/Layout';
import FacultyLayout from './Layouts/FacultyLayout'; // Import FacultyLayout
import AdminLayout from './Layouts/AdminLayout'; // Import AdminLayout
import Home from './pages/Home/Home';
import AdminPortal from './pages/AdminPortal/AdminPortal'; // This can be the main admin page
import StudentPortal from './pages/StudentPortal/StudentPortal';
import BasicTable from './table/BasicTable';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} /> {/* Render Home on the root path */}
      
      <Route path="faculty" element={<FacultyLayout />}>
        <Route index element={<BasicTable />} /> {/* Render BasicTable when the path is '/faculty' */}
      </Route>

      <Route path="admin" element={<AdminLayout />}> {/* Admin layout to wrap admin routes */}
        <Route index element={<AdminPortal />} /> {/* Render AdminPortal at '/admin' */}
        {/* You can add more admin-related routes here */}
      </Route>

      <Route path="student" element={<StudentPortal />} /> {/* Route for student portal */}
    </Route>
  )
);

createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />
  
);