import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from 'lucide-react';

export default function ReleaseFeedbacks() {
  const [academicYear, setAcademicYear] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [isReleased, setIsReleased] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRelease = () => {
    if (!academicYear || !department || !program || !semester || !section) {
      toast({
        title: "Error",
        description: "Please select all required fields before releasing feedbacks.",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const confirmRelease = () => {
    setIsReleased(true);
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Feedbacks have been released successfully.",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-2xl">Release Feedbacks</CardTitle>
        <CardDescription className="text-blue-100">Select the criteria to release student feedbacks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="academicYear" className="text-blue-600">Academic Year</Label>
          <Select onValueChange={setAcademicYear} value={academicYear}>
            <SelectTrigger id="academicYear" className="border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-blue-600">Department</Label>
          <Select onValueChange={setDepartment} value={department}>
            <SelectTrigger id="department" className="border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cse">Computer Science and Engineering</SelectItem>
              <SelectItem value="ece">Electronics and Communication Engineering</SelectItem>
              <SelectItem value="me">Mechanical Engineering</SelectItem>
              <SelectItem value="ce">Civil Engineering</SelectItem>
              <SelectItem value="ee">Electrical Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="program" className="text-blue-600">Program</Label>
          <Select onValueChange={setProgram} value={program}>
            <SelectTrigger id="program" className="border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btech">B.Tech</SelectItem>
              <SelectItem value="mtech">M.Tech</SelectItem>
              <SelectItem value="phd">Ph.D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester" className="text-blue-600">Semester</Label>
          <Select onValueChange={setSemester} value={semester}>
            <SelectTrigger id="semester" className="border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="section" className="text-blue-600">Section</Label>
          <Select onValueChange={setSection} value={section}>
            <SelectTrigger id="section" className="border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
              <SelectItem value="C">Section C</SelectItem>
              <SelectItem value="D">Section D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 border-t border-gray-200">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              onClick={handleRelease} 
              disabled={isReleased}
              className={`${isReleased ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors duration-200`}
            >
              {isReleased ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Feedbacks Released
                </>
              ) : (
                "Release Feedbacks"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Feedback Release</AlertDialogTitle>
              <AlertDialogDescription>
                This action will release feedbacks for {academicYear} {department} {program} Semester {semester} Section {section}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRelease} className="bg-blue-600 text-white hover:bg-blue-700">Release</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {isReleased && <span className="text-green-600 font-semibold">Feedbacks have been released</span>}
      </CardFooter>
    </Card>
  );
}