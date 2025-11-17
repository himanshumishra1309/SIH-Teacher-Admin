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
  // console.log("id", id);
  // console.log("subjectId", subjectId);

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
        // console.log("get lecture", response.data);
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
      console.log({response});
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
      <h1 className="text-3xl font-semibold text-center text-primary mb-6"></h1>
      <LectureAndAttendaceTable teacherId={id} subjectId={subjectId} />
    </div>
  );
};

export default LectureAndAttendance;
