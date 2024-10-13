import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import facultyInfo from "./facultyData.json"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar component


export default function EditFacultyProfile() {
  const handleProfileUpdate = (event) => {
    event.preventDefault();
    // Handle profile update logic here
    console.log('Profile updated!');
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>

      <Card className="w-full shadow-lg rounded-lg overflow-hidden">
    <CardHeader className="bg-gray-100 p-4">
      <div className="flex items-center space-x-6">
        {/* Avatar on the left, Name and Department on the right */}
        <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg transition-transform transform hover:scale-105 rounded-full">
          <AvatarImage src={facultyInfo.avatarUrl} alt={`${facultyInfo.name}'s Avatar`} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl font-semibold text-gray-900">{facultyInfo.name}</CardTitle>
          <p className="text-sm text-gray-500">{facultyInfo.department}</p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-4">
      <p className="text-gray-700">
        <strong className="text-gray-800">Employee Code:</strong> {facultyInfo.employeeCode}
      </p>
      <p className="text-gray-700">
        <strong className="text-gray-800">Email:</strong> {facultyInfo.email}
      </p>
      <p className="text-gray-700">
        <strong className="text-gray-800">Phone:</strong> {facultyInfo.phone}
      </p>
    </CardContent>

    <CardFooter className="bg-gray-50 p-1 flex justify-end">
      <button className="bg-blue-500 text-white px-4 py-2 m-2 rounded-md hover:bg-blue-600 transition duration-200">
        View Profile
      </button>
    </CardFooter>
  </Card>
      
      <form onSubmit={handleProfileUpdate}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input id="subject" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="branch" className="text-right">
              Branch
            </Label>
            <Input id="branch" className="col-span-3" />
          </div>
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
