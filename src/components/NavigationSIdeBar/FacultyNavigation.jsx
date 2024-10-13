import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router-dom';

export default function FacultyNavigation() {
  const navigationItems = [
    { name: "Research Papers Published", path: "/faculty/research-papers" },
    { name: "Expert Lecture Delivered", path: "/faculty/expert-lectures" },
    { name: "STTP Conducted As Coordinator", path: "/faculty/sttp-conducted" },
    { name: "Portfolio At Institute Level", path: "/faculty/institute-portfolio" },
    { name: "Portfolio At Department Level", path: "/faculty/department-portfolio" },
    { name: "MTech/P.Hd Students Guided", path: "/faculty/students-guided" },
    { name: "Event Participation", path: "/faculty/event-participation" },
    { name: "Seminars", path: "/faculty/seminars" },
    { name: "Projects", path: "/faculty/projects" },
    { name: "Lectures", path: "/faculty/lectures" }
  ];

  return (
    <Card className="w-80 rounded-lg mt-5 overflow-hidden shadow-lg p-4">
      <CardHeader className="bg-blue-500 py-3 px-4">
        <h2 className="text-xl font-bold text-white text-center">Navigation</h2>
      </CardHeader>
      <CardContent className="p-0">
        {navigationItems.map((item, index) => (
          <NavLink 
            to={item.path}
            key={index} 
            className="block w-full"
            activeClassName="bg-gray-200" // Optional: to highlight active link
          >
            <Button
              variant="ghost"
              className="w-full justify-start rounded-none border-b border-gray-200 py-3 px-4 text-left font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
            >
              {item.name}
            </Button>
          </NavLink>
        ))}
      </CardContent>
    </Card>
  );
}
