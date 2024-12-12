import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ViewAttendanceTable from "@/table/Tables/Faculty/ViewAttendanceTable";

export default function ViewAttendanceDialog({ isOpen, onClose, lectureData }) {
  console.log(lectureData);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full max-h-[90vh] overflow-auto rounded-lg p-6 bg-white shadow-lg"
        aria-labelledby="attendance-dialog-title"
        aria-describedby="attendance-dialog-description"
      >
        <DialogHeader>
          <DialogTitle
            id="attendance-dialog-title"
            className="text-xl font-semibold"
          >
            Attendance for {lectureData?.topic}
          </DialogTitle>
        </DialogHeader>
        <div id="attendance-dialog-description" className="mb-4">
          <p className="text-gray-600">
            Attendance details for the lecture held on {lectureData?.date}
          </p>
        </div>
        <ViewAttendanceTable lectureData = {lectureData} />
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
