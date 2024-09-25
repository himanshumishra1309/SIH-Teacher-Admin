import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home/Home'
import FacultyPortal from './pages/FacultyPortal/FacultyPortal'
import AdminPortal from './pages/AdminPortal/AdminPortal'
import StudentPortal from './pages/StudentPortal/StudentPortal'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />}>
        <Route path="admin" element={<AdminPortal />} />
        <Route path="faculty" element={<FacultyPortal/>} />
        <Route path="student" element={<StudentPortal/>} />
      </Route >
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
