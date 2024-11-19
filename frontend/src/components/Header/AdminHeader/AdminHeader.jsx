import React from "react";
import { Link } from "react-router-dom";
import AdminAvatar from "./AdminAvatar";

function AdminHeader() {
  return (
    <>
      <header className="flex justify-between items-center py-1 m-0  from-blue-700 to-blue-900 shadow-lg shadow-md">
        <div className="flex items-center">
          <Link to={"#"}>
            <img
              src="../../assets/icons/Logo.svg"
              alt="College Logo"
              className="h-20 w-20
    ml-2 mr-2"
            />
          </Link>
          <Link to={"#"}>
            <h1 className="text-2xl text-white ">
              Education Department
              <br />
              Govt. of NCT of Delhi
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
        <Link to="/home">
          <Button variant="ghost" size="sm" className="text-white hover:text-blue-400">
            <Home className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Home Portal</span>
          </Button>
        </Link>
        <TeacherAvatar />
      </div>
      </header>
    </>
  );
}

export default AdminHeader;
