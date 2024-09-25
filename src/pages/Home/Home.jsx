// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {
  return (
    <div className="w-full flex-grow flex flex-col justify-center items-center  bg-cover bg-center bg-blue-950" >
      <div className="flex flex-col items-center justify-center  text-center text-white">
        <h1 className="text-4xl mt-10 font-bold mb-10">Faculty Appraisal Portal</h1>
        <h1 className="text-4xl font-bold mb-10">Login / Register</h1>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 px-4 mt-10">
          {/* Admin Card */}
          <Link to="/admin" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ">
              <img src="assets\icons\admin.svg" alt="Admin Icon" className="h-32 w-36 mb-4" />
              <h2 className="text-3xl font-semibold text-black">Admin</h2>
            </div>
          </Link>

          {/* Faculty Card */}
          <Link to="/faculty" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
              <img src="assets\icons\faculty.svg" alt="Faculty Icon" className="h-32 w-36 mb-4" />
              <h2 className="text-3xl text-black font-semibold">Faculty</h2>
            </div>
          </Link>

          {/* Student Card */}
          <Link to="/student" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
              <img src="assets\icons\student.svg" alt="Student Icon" className="h-32 w-36 mb-4" />
              <h2 className="text-3xl font-semibold text-black">Student</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
