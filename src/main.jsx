import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layouts/Layout'
import Home from './pages/Home/Home'
import FacultyPortal from './pages/FacultyPortal/FacultyPortal'
import AdminPortal from './pages/AdminPortal/AdminPortal'
import StudentPortal from './pages/StudentPortal/StudentPortal'
import AdminLayout from './Layouts/AdminLayout'
import BasicTable from './table/BasicTable'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="faculty" element={<FacultyLayout/>} >
       <Route path="" element={BasicTable} />
      </Route >
      <Route path="admin" element={<AdminPortal/>} />
      <Route path="student" element={<StudentPortal/>} />
    </Route>
    
  )
)


createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
