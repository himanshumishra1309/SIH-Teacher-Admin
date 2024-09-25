import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

function Header() {
  return (
   <>
   <header className='flex justify-center items-center py-1 m-0 bg-white shadow-md'>
    <div className='flex justify-center items-center'>
      <Link to={"#"}>
      <img  src='assets\icons\college_icon.jpeg' alt="College Logo" className='h-20 w-20
    ml-2 items-center' />
      </Link>
    <h1 className='text-3xl  justify-center'>Government College of Engineering</h1>
    </div>
   </header>
   </>
  )
}

export default Header