import React from 'react'
import { Header } from '@/components'
import { Footer } from '@/components'
import { Link } from 'react-router-dom'


function StudentHome() {
  return (

    <div className="flex flex-col min-h-screen">
    <Header />

    <main className="flex-1">
    <div className="w-full flex-grow flex flex-col justify-center items-center  bg-cover bg-center bg-white" >


<div className="flex flex-col items-center justify-center  text-center text-white">
<h1 className="text-4xl mt-10 font-bold mb-10 text-black font-serif">Student Portal</h1>



<div className="grid grid-cols-1 md:grid-cols-3 gap-20 px-4 mt-10">
  {/* Admin Card */}
  <Link to="/admin-sign-up" className="block">
    <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ">
      <img src="assets\icons\admin.svg" alt="Admin Icon" className="h-32 w-36 mb-4" />
      <h2 className="text-3xl font-semibold text-black">Lecture Feedbacks</h2>
    </div>
  </Link>

  {/* Faculty Card */}
  <Link to="/faculty-sign-up" className="block">
    <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
      <img src="assets\icons\faculty.svg" alt="Faculty Icon" className="h-32 w-36 mb-4" />
      <h2 className="text-3xl text-black font-semibold">Upcoming RSVP</h2>
    </div>
  </Link>

  {/* Student Card */}
  <Link to="/student-sign-up" className="block">
    <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ">
      <img src="assets\icons\student.svg" alt="Student Icon" className="h-32 w-36 mb-4 " />
      <h2 className="text-3xl font-semibold text-black">Seminar Feedback</h2>
    </div>
  </Link>
</div>
</div>
</div>

</main>

  <Footer />
    </div>
  )
}

export default StudentHome