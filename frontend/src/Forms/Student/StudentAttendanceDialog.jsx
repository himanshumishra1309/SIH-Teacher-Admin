import React, {useState ,useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import StudentAttendanceTable from "@/table/Tables/Columns/StudentAttendanceTable";
import { Button } from "@/components/ui/button";

const StudentAttendanceDialog = ({
  isOpen,
  onClose,
  students,
  selectedStudents,
  setSelectedStudents,
  lectureId,
}) => {
  const {subjectId} = useParams();
  console.log("subjectId", subjectId);

  const [attendanceData, setAttendanceData] = useState([]);

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
        console.log("response data:",response.data);
        setAttendanceData(response.data.data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [subjectId]);
  
  const handleMarkAttendance = async () => {
    if (!lectureId) {
      alert("Lecture not added yet!");
      return;
    }

    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const selectedStudentDetails = students.filter((student) =>
        selectedStudents.includes(student._id)
      );

      await axios.post(
        `http://localhost:6005/api/v1/lecture/${lectureId}/attendance`,
        {
          students: selectedStudentDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Attendance marked successfully!");
      onClose();
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Select the students who were present for the lecture.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <StudentAttendanceTable
            students={attendanceData}
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />
        </div>
        <div className="mt-6">
          <Button
            onClick={handleMarkAttendance}
            className="w-full bg-primary text-white rounded hover:bg-primary-dark"
          >
            Mark Attendance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentAttendanceDialog;

