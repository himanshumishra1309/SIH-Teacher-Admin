import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
        <svg
          className="mx-auto w-32 h-32 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-blue-800">Oops! Page Not Found</h1>
        <h2 className="text-xl font-semibold text-blue-600">Looks like this page took an unscheduled leave</h2>
        <p className="text-gray-600">
          We're sorry, but the faculty appraisal page you're looking for seems to be missing from our records. 
          It might have been archived or moved to a different department.
        </p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound