import { Footer, Header } from "@/components";
import React from "react";
import FacultyCards from "./FacultyCards";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";

function AdminHome() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader/>

      <div className="m-20">
        <FacultyCards />
      </div>

      <Footer />
    </div>
  );
}

export default AdminHome;
