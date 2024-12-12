import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import ResearchDistributionPage from "@/pages/AdminPortal/AdminList/HODTaskDistribution/Pages/ResearchDistributionPage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import dialog components
import { Users, FileText } from "lucide-react";
import HODTaskDistributionLayout from "@/Layouts/HODTaskDistributionLayout";

export default function AdminHomeNavigation() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const navigationItems = [
    { name: "Faculty Data", path: "faculty-data", icon: <Users className="w-4 h-4" /> },
    // { name: "HODs Profile", path: "hod-data", icon: <Users className="w-4 h-4" /> },
    {name : "Appraaisal Ranking", path: "appraisal-ranking", icon : <Users className="w-4 h-4" />},
    { name: "Release Feedbacks", path: "release-feedbacks", icon: <FileText className="w-4 h-4" /> },
    { name: "Register Teacher", path: "register-faulty", icon: <Users className="w-4 h-4" /> },
    { name: "Register Student", path: "register-student", icon: <Users className="w-4 h-4" /> },
    { name: "Allocate Subject To Student", path: "allocate-sub-student", icon: <Users className="w-4 h-4" /> },
    { name: "Appraisal Points Allocation", path: "appraisal-points", icon: <Users className="w-4 h-4" /> },
    // { name: "Assign Tasks", action: handleOpenPopup, icon: <FileText className="w-4 h-4" /> },
    { name: "Assign Distribution", path: "weightage-distribution", icon: <FileText className="w-4 h-4" /> },

  ];

  return (
    <>
      <Card className="w-80 rounded-lg mt-5 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4">
          <h2 className="text-xl font-bold text-white text-center">Admin Navigation</h2>
        </CardHeader>
        <CardContent className="p-0">
          <nav>
            {navigationItems.map((item, index) =>
              item.action ? (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={item.action}
                  className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  {item.icon}
                  <span className="truncate ml-2">{item.name}</span>
                </Button>
              ) : (
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
              )
            )}
          </nav>
        </CardContent>
      </Card>

      {/* Popup Dialog */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Task Assignment</DialogTitle>
          </DialogHeader>
          <HODTaskDistributionLayout/>
        </DialogContent>
      </Dialog>
    </>
  );
}
