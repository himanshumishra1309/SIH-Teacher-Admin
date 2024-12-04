import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import FacultyCourseFeedbackTable from "@/table/Tables/Faculty/FacultyCourseFeedbackTable";
import axios from "axios";

export default function ReleaseFeedbacks() {
  const [academicYear, setAcademicYear] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const { toast } = useToast();

  // useEffect(() => {
  //   // Fetch course data here
  //   // For now, we'll use dummy data
  //   // setCourseData([
  //   //   { id: "1", subject_name: "Introduction to Computer Science", subject_code: "CS101", subject_credit: 3, branch: "CSE", year: 1 },
  //   //   { id: "2", subject_name: "Data Structures", subject_code: "CS201", subject_credit: 4, branch: "CSE", year: 2 },
  //   //   // Add more dummy data as needed
  //   // ]);
  // }, []);

  const handleRelease = () => {
    if (selectedCourses.length === 0) {
      toast({
        title: "Error",
        description:
          "Please select at least one course before releasing feedbacks.",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const confirmRelease = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      const isAllSelected = selectedCourses.length === courseData.length;

      const endpoint = isAllSelected
        ? "http://localhost:6005/api/v1/admins/subjects/release-feedback"
        : "http://localhost:6005/api/v1/admins/teachers/release-feedback";

      const activeUntil = new Date();
      activeUntil.setDate(activeUntil.getDate() + 2);

      const payload = isAllSelected
        ? { activeUntil }
        : {
            teachersData: selectedCourses.map((course) => ({
              teacherId: course.teacherId,
              subjectId: course.subjectId,
            })),
            activeUntilDate: activeUntil,
          };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: isAllSelected
            ? "Feedbacks have been released for all courses."
            : `Feedbacks have been released for ${selectedCourses.length} course(s).`,
          variant: "success",
          duration: 3000,
        });
        // console.log(response);

        setSelectedCourses([]);
      } else {
        throw new Error("Failed to release feedbacks.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "An error occurred while releasing feedbacks. Please try again.",
        variant: "destructive",
      });
      console.error("Error releasing feedbacks:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-2xl">Release Feedbacks</CardTitle>
        <CardDescription className="text-blue-100">
          Select courses to release student feedbacks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <FacultyCourseFeedbackTable
          data={courseData}
          setSelectedCourses={setSelectedCourses}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 border-t border-gray-200">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              onClick={handleRelease}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              Release Feedbacks
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Feedback Release</AlertDialogTitle>
              <AlertDialogDescription>
                This action will release feedbacks for {selectedCourses.length}{" "}
                selected course(s). This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRelease}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Release
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
