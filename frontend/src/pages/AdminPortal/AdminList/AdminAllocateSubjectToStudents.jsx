"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { StudentTable } from "@/table/Tables/StudentTable";

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
        setSubjects(response.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch subjects.");
      }
    };
    fetchSubjects();
  }, []);

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedBranch || selectedStudents.length === 0 || !selectedSubject) {
      toast.error("Please select a branch, students, and a subject.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      const payload = {
        subject_name: selectedSubject.subject_name,
        subject_code: selectedSubject.subject_code,
        subject_credit: selectedSubject.subject_credit,
        subject_type: selectedSubject.type,
        teacherId: selectedSubject.teacher,
        selectedStudents: selectedStudents.map(
          (student) => student.original._id
        ),
      };

      const response = await axios.post(
        `http://localhost:6005/api/v1/admins/subjects/student-allocate`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
            className="cursor-pointer bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 transition-all duration-300 hover:shadow-lg hover:scale-105"
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

      {/* Students and Subject Selection */}
      {selectedBranch && (
        <>
          <h3 className="text-lg font-semibold mb-4">Students</h3>
          <StudentTable
            data={students}
            setSelectedStudents={setSelectedStudents}
          />

          <h3 className="text-lg font-semibold mt-6 mb-4">Subjects</h3>
          <Card className="p-4 bg-gradient-to-r from-green-500 via-green-400 to-green-300">
            <Select
              onValueChange={(value) => handleSubjectSelect(JSON.parse(value))}
            >
              <SelectTrigger className="bg-white">
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
          </Card>

          <Button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Allocating..." : "Allocate Subject"}
          </Button>
        </>
      )}
    </div>
  );
};

export default AdminAllocateSubjectToStudent;
