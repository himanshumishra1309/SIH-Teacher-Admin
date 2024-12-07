import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StudentAttendanceDialog from "@/Forms/Student/StudentAttendanceDialog";

const LectureAttendanceDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  selectedLecture,
  setAttendanceDialogOpen,
}) => {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(null);
  const [isMarkAttendanceDialogOpen, setMarkAttendanceDialogOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTopic("");
      setDate(null);
      setMarkAttendanceDialogOpen(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!topic || !date) {
      alert("Please fill out all fields");
      return;
    }
    onSubmit({ topic, date });
    setMarkAttendanceDialogOpen(true); // Open the attendance dialog after adding a lecture
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add Lecture</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium mb-1">
                  Topic
                </label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter lecture topic"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  className="w-full p-2 border rounded border-gray-300"
                  placeholderText="Select a date"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!topic || !date}
                >
                  Add Lecture
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mark Attendance Dialog */}
      <StudentAttendanceDialog
        isOpen={isMarkAttendanceDialogOpen}
        onClose={() => setMarkAttendanceDialogOpen(false)}
        students={[]}
        selectedStudents={[]}
        setSelectedStudents={() => {}}
        lectureId={selectedLecture?._id}
        handleMarkAttendance={() => console.log("Attendance marked!")}
      />
    </>
  );
};

export default LectureAttendanceDrawer;

