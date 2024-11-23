import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import facultyInfo from "./facultyData.json"; // Mock data
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import FacultyCourseTable from "@/table/Tables/FacultyCourseTable";

export default function EditFacultyProfile() {
  const [facultyData, setFacultyData] = useState({
    name: "",
    email: "",
    employee_code: "",
    department: "",
    avatar: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // State for storing avatar file
  const fileInputRef = useRef(null); // Reference to file input for clicking programmatically

  //Fetch faculty data from the backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("teacherAccessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          "http://localhost:6005/api/v1/teachers/me",
          { headers }
        );
        console.log("Faculty data fetched:", response.data);

        setFacultyData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          employee_code: response.data.data.employee_code || "",
          department: response.data.data.department || "",
          avatar: response.data.data.avatar || "", // Set the avatar URL
        });

        
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    fetchProfileData();
  }, []);

  // Handle input change for the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFacultyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Open the confirmation dialog
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      const accessToken = sessionStorage.getItem("teacherAccessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      console.log("Saving changes:", facultyData);
      const response = axios.patch(
        "http://localhost:6005/api/v1/teachers/me/update",
        facultyData,
        { headers }
      );
      console.log("Changes saved:", response);

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Handle avatar upload immediately after file selection
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const accessToken = sessionStorage.getItem("teacherAccessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.put(
        "http://localhost:6005/api/v1/teachers/me/avatar",
        formData,
        { headers }
      );

      console.log("Avatar updated:", response.data);
      setFacultyData((prevData) => ({
        ...prevData,
        avatar: response.data.data.avatar,
      }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full mx-auto p-10 flex">
      <div className="flex flex-col w-full p-5">
      <h1 className="text-3xl font-bold mb-4">Edit Faculty Profile</h1>

      <Card className="w-full shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-100 p-4">
          <div className="relative flex items-center space-x-6">
            {/* Avatar with pencil icon positioned relative to it */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage
                  src={facultyData.avatar}
                  alt={`${facultyData.name}'s Avatar`}
                />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>

              {/* Pencil Icon positioned relative to the avatar */}
              <div
                className="absolute bottom-5 right-2 bg-gray-800 text-white rounded-full p-2 cursor-pointer"
                onClick={triggerFileInput}
                style={{ transform: "translate(50%, 50%)" }} // Moves it slightly outside the avatar
              >
                <AiOutlineEdit className="text-sm" />
              </div>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />

            {/* <div className="flex flex-col">
            <p className="text-xl font-semibold text-gray-900">{facultyData.name}</p>
            <p className="text-sm text-gray-500">{facultyData.department}</p>
          </div> */}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={facultyData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={facultyData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee_code" className="text-right">
                  Employee Code
                </Label>
                <Input
                  id="employee_code"
                  name="employee_code"
                  value={facultyData.employee_code}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={facultyData.department}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>

            {/* Dialog Trigger is now inside Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button type="submit" className="mt-4 bg-blue-500 text-white">
                  Save Changes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Confirm Changes</DialogHeader>
                <p>Are you sure you want to save the changes?</p>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-blue-500 text-white"
                  >
                    Yes, Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
          {/* Avatar Upload Button
          <div className="mt-8">
            <Button
              onClick={handleAvatarUpload}
              className="bg-green-500 text-white"
              disabled={!avatarFile}
            >
              Upload New Avatar
            </Button>
          </div> */}
        </CardContent>
      </Card>
      </div>

      <FacultyCourseTable className="border"/>
    </div>
  );
}
