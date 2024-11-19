import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Link to={"#"} className='flex items-center'>
              <img 
                src='/assets/icons/Logo.svg' 
                alt="College Logo" 
                className='h-16 w-16 object-contain'
              />
            </Link>
            <div className='border-l-2 border-blue-300 pl-4'>
              <Link to={"#"} className='text-white hover:text-blue-200 transition duration-300'>
                <h1 className='text-2xl font-semibold leading-tight'>
                  Education Department
                </h1>
                <p className='text-sm text-blue-200'>
                  Govt. of NCT of Delhi
                </p>
              </Link>
            </div>
          </div>
          
          <div className='flex items-center space-x-4'>
            <h2 className='text-xl font-medium text-white hidden md:block'>
              Faculty Appraisal System
            </h2>
            <img 
              src='/assets/icons/emblem.svg' 
              alt="Government Emblem" 
              className='h-16 w-16 object-contain'
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header