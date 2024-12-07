import React, { useState, useEffect } from "react";
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
import ConfirmationDialog from "./ConfirmationDialog";

const StudentAttendanceDialog = ({
  isOpen,
  onClose,
  students,
  selectedStudents,
  setSelectedStudents,
  lectureId,
  toast,
}) => {
  console.log("lectureID", lectureId);

  const { subjectId } = useParams();
  const [data, setData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [sub, setSub] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

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
        console.log("response data:", response.data);

        setSub(response.data.data.subjectInfo);
        setAttendanceData(response.data.data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [subjectId]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleMarkAttendance = async () => {
    if (!lectureId) {
      alert("Lecture not added yet!");
      return;
    }

    setIsConfirmationOpen(true);
  };

  const confirmMarkAttendance = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const selectedStudentIds = data.map((student) => student._id);

      const response = await axios.post(
        `http://localhost:6005/api/v1/lecture/${lectureId}/attendance`,
        {
          studentIds: selectedStudentIds,
          subject_name: sub.subject_name,
          subject_code: sub.subject_code,
          subject_credit: sub.subject_credit,
          branch: sub.branch,
          year: sub.year,
          date: Date.now(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response);

      toast({
        title: "Success",
        description: "Attendance marked successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to mark attendance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-screen m-6">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Select the students who were present for the lecture.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <StudentAttendanceTable
              students={attendanceData}
              data={data}
              setData={setData}
            />
          </div>
          <div className="mt-2">
            <Button
              onClick={handleMarkAttendance}
              className="w-full bg-primary text-white rounded hover:bg-primary-dark"
            >
              Mark Attendance
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmMarkAttendance}
      />
    </>
  );
};

export default StudentAttendanceDialog;

