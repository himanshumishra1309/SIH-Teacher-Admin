import React from 'react'
import { Outlet } from 'react-router-dom'
import FacultySideBar from './components/FacultySidebar/FacultySideBar'
import { Footer } from './components'

function Layout2() {
  return (
    <>
    <Header />
    <div className='flex'>
    <FacultySideBar />
    <Outlet />
    </div>
    <Footer />
    </>

  )
}

export default Layout2