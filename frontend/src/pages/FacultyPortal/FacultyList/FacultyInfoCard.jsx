import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import { AiOutlineEdit } from "react-icons/ai";
import { useParams } from "react-router-dom";

export default function FacultyInfoCard() {
  const { id } = useParams();
  const [facultyData, setFacultyData] = useState({
    name: "",
    email: "",
    employee_code: "",
    department: "",
    designation: "",
    experience: "",
    qualification: "",
    avatar: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("adminAccessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          `http://localhost:6005/api/v1/admins/teacher/${id}`,
          { headers }
        );
        console.log(response.data.data);
        setFacultyData(response.data.data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFacultyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      console.log(facultyData);
      const accessToken = sessionStorage.getItem("adminAccessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.patch(
        `http://localhost:6005/api/v1/admins/teacher/${id}/update`,
        facultyData,
        { headers }
      );

      console.log(response.data.data);
      setFacultyData(response.data.data);
      setIsDialogOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={facultyData.avatar}
                  alt={`${facultyData.name}'s Avatar`}
                />
                <AvatarFallback className="text-2xl font-bold">
                  {facultyData.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute bottom-0 right-0 bg-white text-blue-500 rounded-full p-2 cursor-pointer shadow-md transition-transform hover:scale-110"
                onClick={triggerFileInput}
              >
                <AiOutlineEdit className="text-xl" />
              </div>
            </div>
            <div className="flex flex-col text-white">
              <h2 className="text-3xl font-bold">{facultyData.name}</h2>
              <p className="text-lg opacity-75">{facultyData.department}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              {[
                "name",
                "email",
                "employee_code",
                "department",
                "designation",
                "experience",
                "qualification",
              ].map((field) => (
                <div key={field} className="flex flex-col space-y-1">
                  <Label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-800" // Darkened the label text
                  >
                    {field
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    value={facultyData[field]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`p-2 rounded-md text-gray-900 ${
                      isEditing
                        ? "bg-white border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        : "bg-gray-200 border-gray-300 text-gray-700"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="submit"
                        className="bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        Save Changes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-lg p-6 shadow-lg">
                      <DialogHeader className="text-xl font-semibold text-gray-900 mb-4">
                        Confirm Changes
                      </DialogHeader>
                      <p className="text-gray-700 mb-6">
                        Are you sure you want to save the changes?
                      </p>
                      <DialogFooter className="flex justify-end space-x-3">
                        <Button
                          variant="ghost"
                          onClick={() => setIsDialogOpen(false)}
                          className="text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveChanges}
                          className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Yes, Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </form>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
