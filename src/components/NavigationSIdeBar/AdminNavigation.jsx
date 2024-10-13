import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router-dom';

export default function AdminNavigation() {
  const navigationItems = [
    { name: "Personal Details", path: "/admin/presonal-details" },
    { name: "Research Papers", path: "/admin/research-papers" },
    { name: "Students Guided", path: "/admin/students-guided" },
    { name: "Portfolio At Institute Level ", path: "/admin/institute-portfolio" },
    { name: "Portfolio At Department Level", path: "/admin/department-portfolio" },
    { name: "Expert Lecture Delivered", path: "/admin/expert-lecture" },
    { name: 
      
      "Event Participation", path: "/admin/event-participation" },
    { name: "Seminars", path: "/admin/seminars" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Contribution Graph", path: "/admin/COntribution-graph" }
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
