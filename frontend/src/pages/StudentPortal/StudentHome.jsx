import React from "react";
import { Footer } from "@/components";
import { Link } from "react-router-dom";
import StudentHeader from "@/components/Header/StudentHeader/StudentHeader";
import { motion } from "framer-motion";

function StudentHome() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
              Student Portal
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl">
            {[
              {
                title: "Lecture Feedbacks",
                icon: "teachings.png",
                link: "/student/lecture",
              },
              {
                title: "Seminars",
                icon: "seminar.png",
                link: "/student/seminar",
              },
            ].map((item, index) => (
              <Link to={item.link} key={item.title} className="block">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center h-full border border-blue-100 hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={`/assets/icons/${item.icon}`}
                    alt={`${item.title} Icon`}
                    className="h-24 w-24 mb-6 object-contain"
                  />
                  <h2 className="text-2xl font-semibold text-blue-800">
                    {item.title}
                  </h2>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default StudentHome;
