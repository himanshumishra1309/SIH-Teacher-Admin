import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TeacherAvatar from "./TeacherAvatar";
import { Home, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ResponsiveHeader() {
  return (
    <header className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg text-white">
      <div className="flex items-center space-x-4">
        <Link to="/faculty-home" className="flex items-center space-x-2">
          <img
            src="/assets/icons/Logo.svg"
            alt="College Logo"
            className="h-12 w-12"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold leading-tight">
              Education Department
            </h1>
            <p className="text-sm">Govt. of NCT of Delhi</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link to="/" className="hidden sm:block">
          <Button variant="ghost" size="sm" className="text-white hover:text-blue-400">
            <Home className="mr-2 h-4 w-4" />
            <span>Home Portal</span>
          </Button>
        </Link>
        <TeacherAvatar />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <Home className="h-4 w-4" />
                <span>Home Portal</span>
              </Link>
              {/* Add more navigation items here */}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

