import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Link } from "react-router-dom";

const branches = [
  { value: "All", label: "All Courses" },
  { value: "Data Structures", label: "Data Structures" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "OS", label: "OS" },
  { value: "Psychology", label: "Psychology" },
  { value: "Corporate Values", label: "Corporate Values" },
  { value: "Chemical", label: "Chemical" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  // Add more options as needed
];

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Header } from "@/components";
import EventRSVP from "../AdminPortal/AdminList/EventRsvp";
import EnhancedLectureFeedback from "../AdminPortal/AdminList/LectureFeedback";
import EventRsvp from "../AdminPortal/AdminList/EventRsvp";
import axios from "axios";

export default function SeminarCards() {
  const [facultyData, setFacultyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");

  // Fetch faculty data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the access token from session storage or wherever you have stored it
        const accessToken = sessionStorage.getItem("studentAccessToken");

        // Make the request with the Authorization header
        const response = await axios.get(
          "http://localhost:6005/api/v1/seminars/seminars/upcoming",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(response.data.data);
        setFacultyData(response.data.data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter the cards based on search and selected branch
  const filteredSeminars = facultyData.filter((seminar) => {
    const matchesSearchTerm = seminar.topic
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBranch =
      selectedBranch === "All" || seminar.department === selectedBranch;
    return matchesSearchTerm && matchesBranch;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-center font-serif font-semibold">
        Upcoming Seminars
      </h1>
      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg w-1/2"
          placeholder="Search by Topic"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={(value) => setSelectedBranch(value)}>
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
      </div>

      {/* ScrollArea for Seminar Cards */}
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredSeminars.map((seminar) => (
            <Card
              key={seminar._id}
              className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {seminar.topic}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Duration: {seminar.duration} hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Owner: {seminar.owner}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(seminar.date).toDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Department: {seminar.department}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <EventRsvp seminarId={seminar._id} /> {/* RSVP Component */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
