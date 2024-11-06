// src/pages/Home/Home.jsx
"use-client";
import { Footer, Header } from "@/components";
import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { motion } from "framer-motion";
const Home = () => {
  const cardVariants = {};

  return (
    <div className="container">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-gradient-ellipse ">
          <div className="w-full flex-grow flex flex-col justify-center items-center  bg-cover bg-center  ">
            <div className="flex flex-col items-center justify-center  text-center text-white">
              <div>
                <h1 className="text-4xl tracking-tighter mt-10 font-bold mb-10 font-serif bg-gradient-to-r from-black to-[#001E80] text-transparent bg-clip-text">
                  Appraisal Portal
                </h1>
                <h1 className="text-4xl font-bold mb-10 text-black font-serif">
                  Login / Register
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-32 px-4 my-10">
                {/* Admin Card */}

                {/* Faculty Card */}
                <Link to="/faculty-sign-up" className="block">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 50,
                      damping: 5,
                      duration: 0.1,
                    }}
                    whileHover={{ scale: [null, 1.05, 1.05] }}
                    className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src="assets\icons\faculty.svg"
                      alt="Faculty Icon"
                      className="h-32 w-36 mb-4"
                    />
                    <h2 className="text-3xl text-black font-semibold">
                      Faculty
                    </h2>
                  </motion.div>
                </Link>

                <Link to="/admin-sign-up" className="block">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 50,
                      damping: 5,
                      duration: 0.1,
                    }}
                    whileHover={{ scale: [null, 1.05, 1.05] }}
                    className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 "
                  >
                    <img
                      src="assets\icons\admin.svg"
                      alt="Admin Icon"
                      className="h-32 w-36 mb-4"
                    />
                    <h2 className="text-3xl font-semibold text-black">Admin</h2>
                  </motion.div>
                </Link>

                {/* Student Card */}
                <Link to="/student-sign-up" className="block">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 50,
                      damping: 5,
                      duration: 0.1,
                    }}
                    whileHover={{ scale: [null, 1.05, 1.05] }}
                    layout
                    className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 "
                  >
                    <img
                      src="assets\icons\student.svg"
                      alt="Student Icon"
                      className="h-32 w-36 mb-4 "
                    />
                    <h2 className="text-3xl font-semibold text-black">
                      Student
                    </h2>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer className="" />
      </div>
    </div>
  );
};

export default Home;
