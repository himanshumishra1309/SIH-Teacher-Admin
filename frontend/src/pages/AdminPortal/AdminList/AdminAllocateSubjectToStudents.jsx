"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

const AdminAllocateSubjectToStudent = () => {
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = sessionStorage.getItem("adminAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/admins/branches`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBranches(response.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch branches.");
      }
    };
    fetchBranches();
  }, []);

  // Fetch students
  const fetchStudents = async (branchName) => {
    setSelectedBranch(branchName);
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      const response = await axios.get(
        `http://localhost:6005/api/v1/admins/branches/${branchName}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch students.");
    }
  };

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = sessionStorage.getItem("adminAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/admins/subjects/allSubjects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log(response.data.data);
        setSubjects(response.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch subjects.");
      }
    };
    fetchSubjects();
  }, []);

  // Handle checkbox toggle
  const handleCheckboxToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedBranch || !selectedStudents.length || !selectedSubject) {
      toast.error("Please select a branch, students, and a subject.");
      return;
    }

    setLoading(true);
    try {
      console.log(selectedStudents);
      const token = sessionStorage.getItem("adminAccessToken");
      const payload = {
        subject_name: selectedSubject.subject_name,
        subject_code: selectedSubject.subject_code,
        subject_credit: selectedSubject.subject_credit,
        subject_type: selectedSubject.type,
        teacherId: selectedSubject.teacher,
        selectedStudents,
      };
      console.log(payload);

      const response = await axios.post(
        `http://localhost:6005/api/v1/admins/subjects/student-allocate`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response)

      toast.success(
        response.data.message || "Subjects allocated successfully!"
      );
      setSelectedStudents([]);
      setSelectedSubject(null);
    } catch (error) {
      toast.error("Failed to allocate subjects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Allocate Subject to Students
      </h2>

      {/* Branch Selection */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {branches.map((branch) => (
          <Card
            key={branch}
            className="cursor-pointer bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"
            onClick={() => fetchStudents(branch)}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                {branch}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-200">
                Click to view students
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* {console.log(selectedStudents)} */}

      {/* Students and Subject Selection */}
      {selectedBranch && (
        <>
          <h3 className="text-lg font-semibold mb-4">Students</h3>
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedStudents.includes(student._id)}
                  onCheckedChange={() => handleCheckboxToggle(student._id)}
                />
                <span>{student.name}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Subjects</h3>
          <Select
            onValueChange={(value) => handleSubjectSelect(JSON.parse(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem
                  key={subject.subject_code}
                  value={JSON.stringify(subject)}
                >
                  {subject.subject_name} ({subject.subject_type} -{" "}
                  {subject.subject_credit} credits)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="mt-6" onClick={handleSubmit} disabled={loading}>
            {loading ? "Allocating..." : "Allocate Subject"}
          </Button>
        </>
      )}
    </div>
  );
};

export default AdminAllocateSubjectToStudent;
