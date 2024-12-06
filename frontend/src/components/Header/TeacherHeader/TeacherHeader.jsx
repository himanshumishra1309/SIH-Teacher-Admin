import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TeacherAvatar from "./TeacherAvatar";
import { Home } from 'lucide-react';

export default function TeacherHeader() {
  return (
    <header className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg text-white shadow-md">
      <div className="flex items-center space-x-4">
        <Link to="/faculty-home" className="flex items-center space-x-2">
          <img
            src="/assets/icons/Logo.svg"
            alt="College Logo"
            className="h-12 w-12"
          />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold leading-tight">
              Education Department
            </h1>
            <p className="text-sm">Govt. of NCT of Delhi</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-white hover:text-blue-400">
            <Home className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Home Portal</span>
          </Button>
        </Link>
        <TeacherAvatar />
      </div>
    </header>
  );
}