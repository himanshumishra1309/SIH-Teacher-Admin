import React, { useEffect, useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Link } from "react-router-dom";

const branches = [
  { value: "All", label: "All Departments" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Mechanical", label: "Mechanical" },
  { value: "Electrical", label: "Electrical" },
  { value: "Civil", label: "Civil" },
  { value: "Chemical", label: "Chemical" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  // Add more options as needed
];

const myAnimation = {
  hover: { borderColor: "transparent", scale: 1.1 },
  tap: { borderColor: "transparent", scale: 0.95 },
  focus: { borderColor: "white", scale: 1.1, transition: { duration: 0.15 } },
};

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function FacultyCards() {
  const [facultyData, setFacultyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from cookies or local storage
        const token = sessionStorage.getItem("adminAccessToken"); // Adjust this if using cookies

        const response = await axios.get(
          "http://localhost:6005/api/v1/admins/teachers",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header
            },
          }
        );

        console.log(response.data.data.teachers);
        setFacultyData(response.data.data.teachers); // Assuming the API response has a `teachers` array
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredFaculty = facultyData.filter((faculty) => {
    const matchesSearchTerm =
      (faculty.name &&
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (faculty.employee_code &&
        faculty.employee_code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch =
      selectedBranch === "All" ||
      (faculty.department && faculty.department === selectedBranch);

    return matchesSearchTerm && matchesBranch;
  });

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        {/* Set ScrollArea with limited height for the cards */}
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          {/* Search Bar */}
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-lg w-1/2"
            placeholder="Search by Name or Employee Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ascending">Ascending</SelectItem>
              <SelectItem value="descending">Descending</SelectItem>
            </SelectContent>
          </Select>
          {/* Dropdown for Department Filter */}
          <Select
            onValueChange={(value) => setSelectedBranch(value)}
            defaultValue={selectedBranch}
          >
            <SelectTrigger className="p-2 border border-gray-300 rounded-lg max-w-40">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-auto">
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={branch.value}>
                  {branch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dropdown for Department Filter
                <select
          className="p-2 border border-gray-300 rounded-lg"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Mechanical">Mechanical</option>
          {/* Add more options based on available departments */}
          {/* </select> */}
        </div>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredFaculty.map((faculty) => (
              <Card
                key={faculty.id}
                className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <CardHeader className="flex items-center space-x-4">
                  <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                    <AvatarImage
                      src={faculty.avatarUrl || "/default-avatar.png"}
                      alt={`${faculty.name}'s Avatar`}
                    />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {faculty.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {faculty.department}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <h2 className="text-base">
                    Employee Code: {faculty.employee_code}
                  </h2>
                  <h2 className="text-base">Email: {faculty.email}</h2>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link to={`/admin-info/${faculty._id}`}>
                    <Button variant="default" className="text-white"  >
                      Check Profile 
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>{" "}
      </div>
    </>
  );
}
