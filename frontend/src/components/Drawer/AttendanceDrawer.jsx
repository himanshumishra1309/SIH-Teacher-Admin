import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AttendanceModal } from "./AttendanceModal";

const AttendanceDrawer = ({ isOpen, onClose, onSubmit, rowData }) => {
  const [formData, setFormData] = useState({
    topic: rowData?.topic || "",
    duration: rowData?.duration || "",
    date: rowData?.date || "",
  });
  const [isAttendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Add a New Entry</DrawerTitle>
            </DrawerHeader>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Lecture Topic</label>
                <Input
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mark Attendance</label>
                <Button
  onClick={() => {
    console.log("Selected lecture:", row.original); // Debug log
    setSelectedLecture(row.original);
    setAttendanceDialogOpen(true);
  }}
  className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  Mark Attendance
</Button>

              </div>
              <DrawerFooter>
                <Button type="submit">Add Entry</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        onSubmit={(selectedStudents) => {
          console.log("Selected students:", selectedStudents);
          setAttendanceModalOpen(false);
        }}
        students={[]} // Pass your actual students data here
        lectureId={rowData?._id || "new"}
      />
    </>
  );
};

export default AttendanceDrawer;
