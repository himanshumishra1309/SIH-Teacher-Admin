import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, Mic, Users, GraduationCap, Calendar, PresentationIcon as PresentationChart, Briefcase, BarChart2, Menu } from 'lucide-react';

export default function FacultyNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Appraisal report", path: "appraisal-report", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Teaching Process", path: "teaching-process", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Research Papers", path: "research-papers", icon: <FileText className="w-4 h-4" /> },
    { name: "Expert Lectures Delivered", path: "expert-lectures", icon: <Mic className="w-4 h-4" /> },
    { name: "STTP Conducted", path: "sttp-conducted", icon: <Users className="w-4 h-4" /> },
    { name: "Students Guided", path: "students-guided", icon: <GraduationCap className="w-4 h-4" /> },
    { name: "Event Participation", path: "event-participation", icon: <Calendar className="w-4 h-4" /> },
    { name: "Seminars", path: "seminars", icon: <PresentationChart className="w-4 h-4" /> },
    { name: "Projects", path: "projects", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Contributions/ Achievements", path: "posts", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Add Lecture", path: "lecAttend", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Points", path: "faculty-points", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const NavigationContent = () => (
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
          onClick={() => setIsOpen(false)}
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
  );

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4">
              <h2 className="text-xl font-bold text-white text-center">Faculty Navigation</h2>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-60px)]">
                <NavigationContent />
              </ScrollArea>
            </CardContent>
          </Card>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <Card className="hidden md:block w-64 lg:w-80 rounded-lg mt-5 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4">
          <h2 className="text-xl font-bold text-white text-center">Faculty Navigation</h2>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <NavigationContent />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}

