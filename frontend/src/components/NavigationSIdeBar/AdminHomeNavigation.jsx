import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router-dom';
import { BookOpen, FileText, Mic, Users, GraduationCap, Calendar, PresentationIcon as PresentationChart, Briefcase, BarChart2 } from 'lucide-react';

export default function AdminHomeNavigation() {
  const navigationItems = [
    { name: "Faculty Data", path: "faculty-data", icon: <Users className="w-4 h-4" /> },
    { name: "Allocate lectures", path: "allocate-lectures", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Release Feedbacks", path: "release-feedbacks", icon: <FileText className="w-4 h-4" /> },
    { name: "Register Teacher", path: "register-faulty", icon: <Users className="w-4 h-4" /> },
    { name: "Register Student", path: "register-student", icon: <Users className="w-4 h-4" /> },
    { name: "Allocate Subject To Student", path: "allocate-sub-student", icon: <Users className="w-4 h-4" /> },
    { name: "Appraisal Points", path: "appraisal-points", icon: <Users className="w-4 h-4" /> },



    // { name: "Expert Lectures", path: "expert-lectures", icon: <Mic className="w-4 h-4" /> },
    // { name: "Students Guided", path: "students-guided", icon: <GraduationCap className="w-4 h-4" /> },
    // { name: "Event Participation", path: "event-participation", icon: <Calendar className="w-4 h-4" /> },
    // { name: "Seminars", path: "seminars", icon: <PresentationChart className="w-4 h-4" /> },
    // { name: "Projects", path: "projects", icon: <Briefcase className="w-4 h-4" /> },
    // { name: "Contribution Graph", path: "contribution", icon: <BarChart2 className="w-4 h-4" /> }
  ];

  return (
    <Card className="w-80 rounded-lg mt-5 overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4">
        <h2 className="text-xl font-bold text-white text-center">Admin Navigation</h2>
      </CardHeader>
      <CardContent className="p-0">
        <nav>
          {navigationItems.map((item, index) => (
            <NavLink 
              to={item.path}
              key={index} 
              className={({ isActive }) => 
                `flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors ${
                  isActive ? 'bg-blue-100 font-semibold' : ''
                }`
              }
            >
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-none text-left text-sm font-normal ${
                    isActive ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="truncate ml-2">{item.name}</span>
                </Button>
              )}
            </NavLink>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}