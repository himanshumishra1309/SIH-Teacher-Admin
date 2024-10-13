import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the hook for navigation

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function TeacherAvatar() {
  const navigate = useNavigate();  // Create a navigate function from the hook

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout logic
  };

  const handleEditProfile = () => {
    navigate('/faculty/edit-profile');  // Navigate to Edit Profile page
  };

  return (
    <header>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
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
