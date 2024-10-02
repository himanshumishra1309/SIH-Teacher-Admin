import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../components'
import FacultyNavigation from '@/components/FacultySidebar/FacultyNavigation'

function FacultyLayout() {
  return (
    <>
    <FacultyNavigation />
    <Outlet />
    </>

  )
}

export default FacultyLayout