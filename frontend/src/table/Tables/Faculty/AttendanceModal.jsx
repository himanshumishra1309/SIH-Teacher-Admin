import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/"; // Adjust path for ShadCN modal
import { Button } from "@/components/ui/button";

const AttendanceModal = ({ isOpen, onClose, onSubmit, lecture }) => {
  const handleSubmit = () => {
    const attendanceData = {}; // Replace with actual data
    onSubmit(attendanceData);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader>
        Mark Attendance for {lecture?.title || "Lecture"}
      </ModalHeader>
      <ModalBody>
        {/* Attendance form or content goes here */}
        <p>Attendance marking features will be added soon!</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSubmit} className="bg-green-500 text-white">
          Submit
        </Button>
        <Button onClick={onClose} className="ml-2">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AttendanceModal;
