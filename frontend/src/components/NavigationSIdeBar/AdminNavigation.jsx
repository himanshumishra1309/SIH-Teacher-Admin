import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Mic,
  Users,
  GraduationCap,
  Calendar,
  PresentationIcon as PresentationChart,
  Briefcase,
  BarChart2,
} from "lucide-react";

export default function AdminNavigation() {
  const navigationItems = [
    {
      name: "Personal Details",
      path: "personal-details",
      icon: <Users className="w-4 h-4" />,
    },
    // { name: "Teaching Process", path: "teaching-process", icon: <BookOpen className="w-4 h-4" /> },
    {
      name: "Appraisal report",
      path: "admin-teacher-appraisal",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      name: "Research Papers",
      path: "research-papers",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      name: "STTP Conducted",
      path: "sttp-conducted",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Students Guided",
      path: "students-guided",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      name: "Expert Lecture Delivered",
      path: "expert-lecture",
      icon: <Mic className="w-4 h-4" />,
    },
    {
      name: "Event Participation",
      path: "event-participation",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      name: "Contributions/Achievements",
      path: "contribution-achievement",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      name: "Seminars",
      path: "seminars",
      icon: <PresentationChart className="w-4 h-4" />,
    },
    {
      name: "Projects",
      path: "projects",
      icon: <Briefcase className="w-4 h-4" />,
    },
    // { name: "Contribution Graph", path: "contribution", icon: <BarChart2 className="w-4 h-4" /> },
    // { name: "Posts", path: "posts", icon: <BarChart2 className="w-4 h-4" /> },

    // { name: "Add Lecture", path: "teacheraddecture", icon: <BarChart2 className="w-4 h-4" /> },
    {
      name: "Allocate Subject To Teacher",
      path: "adminallocate-lectures",
      icon: <FileText className="w-4 h-4" />,
    },

    // { name: "Add Lecture", path: "lecAttend", icon: <BarChart2 className="w-4 h-4" /> },

    // { name: "Peer Review", path: "peer-review", icon: <BarChart2 className="w-4 h-4" /> }
  ];

  return (
    <Card className="w-80 rounded-lg mt-5 overflow-hidden shadow-lg ">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4">
        <h2 className="text-xl font-bold text-white text-center">
          Admin Navigation
        </h2>
      </CardHeader>
      <CardContent className="p-0">
        <nav>
          {navigationItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors ${
                  isActive ? "bg-blue-100 font-semibold" : ""
                }`
              }
            >
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-none text-left text-sm font-normal ${
                    isActive ? "text-blue-700" : "text-gray-700"
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
