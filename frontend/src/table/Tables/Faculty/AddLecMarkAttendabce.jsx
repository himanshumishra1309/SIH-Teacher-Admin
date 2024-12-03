"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import LectureAndAttendaceTable from "./LectureAttendanceTable";

const AddLecMarkAttendance = () => {
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    topic: "",
    duration: "",
    date: "",
  });
  const [lectureId, setLectureId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch subjects taught by the teacher
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/allocated-subjects/subjects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubjects(response.data.data.subjects || []);
        console.log(subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [id]);

  // Fetch students for the selected subject
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedSubject) {
        const token = sessionStorage.getItem("teacherAccessToken");
        try {
          const response = await axios.get(
            `http://localhost:6005/api/v1/lecture/${selectedSubject?._id}/students`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStudents(response.data.data.students || []);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      }
    };
    fetchStudents();
  }, [selectedSubject?._id]);

  // Handle lecture form submission
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!lectureDetails.topic || !lectureDetails.date) {
      alert("All fields are required!");
      return;
    }

    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.post(
        `http://localhost:6005/api/v1/lecture/${selectedSubject?._id}/${id}/lectures`,
        lectureDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLectureId(response.data.data._id);
      alert("Lecture added successfully!");
    } catch (error) {
      console.error("Error adding lecture:", error);
    }
  };

  // Handle attendance submission
  const handleMarkAttendance = async () => {
    if (!lectureId) {
      alert("Lecture not added yet!");
      return;
    }

    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const { subject_name, subject_code, subject_credit, branch, year } =
        selectedSubject;

      const response = await axios.post(
        `http://localhost:6005/api/v1/lecture/${lectureId}/attendance`,
        {
          studentIds: selectedStudents,
          subject_name,
          subject_code,
          subject_credit,
          branch,
          year,
          date: lectureDetails?.date, // checking
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("atendance", response);

      alert("Attendance marked successfully!");
      setSelectedStudents([]); // Reset selected students
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center text-primary">
        Manage Lectures and Attendance
      </h1>
      {/* Step 1: Display Subject Cards */}
      {!selectedSubject?._id && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="p-6 border rounded-lg shadow-lg hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setSelectedSubject(subject)}
            >
              <h2 className="text-xl font-semibold">{subject.subject_name}</h2>
              <p className="text-sm text-gray-500">{subject.subject_code}</p>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Add Lecture */}
      {selectedSubject?._id && !lectureId && (
        <form
          onSubmit={handleAddLecture}
          className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md mt-8"
        >
          <h2 className="text-2xl font-medium text-center">Add Lecture</h2>
          <div>
            <Label htmlFor="topic">Lecture Topic</Label>
            <Input
              id="topic"
              placeholder="Enter topic"
              value={lectureDetails.topic}
              onChange={(e) =>
                setLectureDetails({ ...lectureDetails, topic: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (in hours)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="Enter duration"
              value={lectureDetails.duration}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  duration: e.target.value,
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={lectureDetails.date}
              onChange={(e) =>
                setLectureDetails({ ...lectureDetails, date: e.target.value })
              }
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark"
          >
            Add Lecture
          </Button>
        </form>
      )}

      {/* Step 3: Display Students and Mark Attendance */}

      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Mark Attendance</h2>
        {students.length === 0 ? (
          <p>No students found for this subject.</p>
        ) : (
          students.map((student) => (
            <div key={student._id} className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                value={student._id}
                checked={selectedStudents.includes(student._id)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedStudents((prev) =>
                    isChecked
                      ? [...prev, student._id]
                      : prev.filter((id) => id !== student._id)
                  );
                }}
                className="checkbox"
              />
              <span className="font-medium text-lg">
                {student.name} ({student.roll_no})
              </span>
            </div>
          ))
        )}
        {lectureId && (
          <Button
            onClick={handleMarkAttendance}
            className="mt-4 w-full bg-primary hover:bg-primary-dark"
          >
            Mark Attendance
          </Button>
        )}
      </div>
      <LectureAndAttendaceTable teacherId = {id} subjectId = {selectedSubject?._id} />
    </div>
  );
};

export default AddLecMarkAttendance;
