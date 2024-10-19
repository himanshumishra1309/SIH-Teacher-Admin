import React from 'react'
import {Link, NavLink} from "react-router-dom"


function Footer() {
  return (
    <footer className=' bg-gray-700 text-[#BCBCBC] text-sm py-10 text-center'>
      <div className='container'>
<img src="frontend\assets\icons\Logo.svg" alt="Icon" height={40}/>
      </div>
      <nav className='flex flex-col my-2  md:flex-row md:justify-center gap-6 '>
        <a href='#'>Careers</a>
        <a href='#'>About</a>
        <a href='#'>Help</a>
        <a href='#'>Pricing</a>
        <a href='#'>Features</a>
      </nav>
      <div className='flex justify-center'>

      </div>
      <p>Company 2024. All Rights Reserved</p>
    </footer>

  )
}

export default Footer