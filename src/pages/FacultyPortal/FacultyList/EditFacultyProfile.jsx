import React, { useState } from "react";
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

export default function EditFacultyProfile() {
  const [facultyData, setFacultyData] = useState({
    name: facultyInfo.name,
    subject: facultyInfo.subject,
    branch: facultyInfo.branch,
    email: facultyInfo.email,
    phone: facultyInfo.phone,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Handle confirmation of save
  const handleSaveChanges = () => {
    setIsDialogOpen(false);
    console.log("Changes saved:", facultyData);
    // Perform save logic, like sending the updated data to the backend.
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Edit Faculty Profile</h1>

      <Card className="w-full shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-100 p-4">
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
              <AvatarImage src={facultyInfo.avatarUrl} alt={`${facultyInfo.name}'s Avatar`} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-xl font-semibold text-gray-900">{facultyInfo.name}</p>
              <p className="text-sm text-gray-500">{facultyInfo.department}</p>
            </div>
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
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={facultyData.subject}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch" className="text-right">
                  Branch
                </Label>
                <Input
                  id="branch"
                  name="branch"
                  value={facultyData.branch}
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
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={facultyData.phone}
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
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges} className="bg-blue-500 text-white">
                    Yes, Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
 