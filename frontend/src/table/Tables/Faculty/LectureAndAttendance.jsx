"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LectureAndAttendaceTable from "./LectureAttendanceTable";

const LectureAndAttendance = () => {
  const { id, subjectId } = useParams(); // Teacher ID and Subject ID
  console.log("id", id);
  console.log("subjectId", subjectId);

  const { state } = useLocation();
  const [students, setStudents] = useState([]);
  const [lectureDetails, setLectureDetails] = useState({
    topic: "",
    duration: "",
    date: "",
  });
  const [lectureId, setLectureId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // const { subject_name } = state.subject;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/lecture/${subjectId}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setStudents(response.data.data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [subjectId]);

  const handleAddLecture = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.post(
        `http://localhost:6005/api/v1/lecture/${subjectId}/${id}/lectures`,
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

  const handleMarkAttendance = async () => {
    if (!lectureId) {
      alert("Lecture not added yet!");
      return;
    }
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.post(
        `http://localhost:6005/api/v1/lecture/${lectureId}/attendance`,
        {
          studentIds: selectedStudents,
          date: lectureDetails.date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-primary mb-6">
        {/* {subject_name} */}
      </h1>
      {/* Add Lecture */}
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
              setLectureDetails({ ...lectureDetails, duration: e.target.value })
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

      {/* Mark Attendance */}
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
      <LectureAndAttendaceTable teacherId={id} subjectId={subjectId} />
    </div>
  );
};

export default LectureAndAttendance;
