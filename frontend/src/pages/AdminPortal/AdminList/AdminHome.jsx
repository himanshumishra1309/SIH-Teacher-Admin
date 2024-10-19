import { Footer, Header } from "@/components";
import React from "react";
import FacultyCards from "./FacultyCards";

function AdminHome() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="m-20">
        <FacultyCards />
      </div>

      <Footer />
    </div>
  );
}

export default AdminHome;
