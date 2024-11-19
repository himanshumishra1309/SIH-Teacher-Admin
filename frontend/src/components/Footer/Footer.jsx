import React from 'react'
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className='bg-blue-900 text-white py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='flex flex-col items-center md:items-start'>
            <img src="/assets/icons/govt-logo.svg" alt="Government Logo" className="h-16 mb-4" />
            <p className='text-sm text-center md:text-left'>Education Department<br />Govt. of NCT of Delhi</p>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-4'>Quick Links</h3>
            <nav className='flex flex-col space-y-2'>
              <Link to="#" className='hover:text-blue-300 transition-colors'>Home</Link>
              <Link to="#" className='hover:text-blue-300 transition-colors'>Faculty Portal</Link>
              <Link to="#" className='hover:text-blue-300 transition-colors'>Admin Dashboard</Link>
              <Link to="#" className='hover:text-blue-300 transition-colors'>Student Feedback</Link>
            </nav>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-4'>Resources</h3>
            <nav className='flex flex-col space-y-2'>
              <Link to="#" className='hover:text-blue-300 transition-colors'>FAQs</Link>
              <Link to="#" className='hover:text-blue-300 transition-colors'>User Guide</Link>
              <Link to="#" className='hover:text-blue-300 transition-colors'>Privacy Policy</Link>
              <Link to="#" className='hover:text-blue-300 transition-colors'>Terms of Service</Link>
            </nav>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-4'>Contact Us</h3>
            <address className='not-italic text-sm'>
              <p>Education Department</p>
              <p>Old Secretariat, Delhi-110054</p>
              <p>Email: info@education.delhi.gov.in</p>
              <p>Phone: +91-11-23890000</p>
            </address>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm'>&copy; 2024 Education Department, Govt. of NCT of Delhi. All Rights Reserved.</p>
          <div className='flex space-x-4 mt-4 md:mt-0'>
            <a href="#" aria-label="Facebook">
              <img src="/assets/icons/facebook.svg" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src="/assets/icons/twitter.svg" alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer