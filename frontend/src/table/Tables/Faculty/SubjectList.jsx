"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SubjectCard from "./SubjectCard";

const SubjectList = () => {
  const { id } = useParams(); // Teacher ID
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

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
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [id]);

  const handleSubjectClick = (subject) => {
    const subjectId = subject._id;
    navigate(`/faculty/${id}/subject/${subjectId}`, { state: { subject } });
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center text-primary">
        Select a Subject
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject._id}
            subject={subject}
            onClick={handleSubjectClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectList;
