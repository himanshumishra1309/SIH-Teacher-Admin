import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the hook for navigation

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import axios from 'axios';

export default function FacultyAvatar() {
  const navigate = useNavigate();  // Create a navigate function from the hook

  const handleLogout = async () => {
    console.log("Logging out...");

    try { 
      await axios.post(
        "http://localhost:6005/api/v1/teachers/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              "teacherAccessToken"
            )}`,
          },
        }
      );

      sessionStorage.removeItem("teacherAccessToken");

      console.log("Logout successful");

      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error during logout:", errorMessage);
      alert("Logout failed. Please try again.");
    }
  };

  const handleEditProfile = () => {
    navigate('/faculty/edit-profile');  // Navigate to Edit Profile page
  };

  return (
    <header>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full m-5">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Teacher" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onSelect={handleEditProfile}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
