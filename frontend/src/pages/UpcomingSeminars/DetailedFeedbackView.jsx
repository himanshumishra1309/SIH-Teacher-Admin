import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const feedbackCriteria = [
  "Has the Teacher covered entire Syllabus as prescribed by University/College/Board?",
  "Has the Teacher covered relevant topics beyond syllabus",
  "Effectiveness of Teacher in terms of Technical content, Communication skills and Use of teaching aids",
  "Pace on which contents were covered",
  "Motivation and inspiration for students to learn",
  "Support for development of Students' skill in terms of Practical demonstration and Hands on training",
  "Clarity of expectations of students",
  "Feedback provided on Students' progress",
  "Willingness to offer help and advice to students.",
  "Overall performance of the student",
];

export function DetailedFeedbackView({ isOpen, onClose, feedback }) {
  const [feedbackData, setFeedbackData] = useState({
    subject_name: "",
    subject_code: "",
    ratings: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectureCriteria = async () => {
      if (!isOpen || !feedback.feedbackId) return;

      setLoading(true);
      try {
        const token = sessionStorage.getItem("teacherAccessToken");
        if (!token) {
          console.error("Access token is missing.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const feedbackId = feedback.feedbackId;

        const response = await axios.get(
          `http://localhost:6005/api/v1/lec-feedback/detailed/${feedbackId}`,
          { headers }
        );

        console.log(response);
        
        setFeedbackData(response.data.data || {});
      } catch (error) {
        console.error("Error in getting the lecture criteria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectureCriteria();
  }, [isOpen, feedback]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden bg-white">
        <DialogHeader className="sticky top-0 z-50 bg-[rgb(37,78,235)] text-white border-b p-6">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              Detailed Feedback Report
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              className="p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5 text-white" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <p className="text-white/80 mt-2">
            {loading ? "Loading..." : `${feedbackData.subject_name} (${feedbackData.subject_code})`}
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-[calc(90vh-180px)]">
            <p className="text-gray-500">Loading detailed feedback...</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(90vh-180px)] px-6 py-4">
            <div className="space-y-6">
              {feedbackCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <h3 className="text-lg font-medium text-black mb-3">
                    {criterion}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 transition-colors ${
                            star <= feedbackData.ratings[`question${index + 1}`]
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-[rgb(37,78,235)]">
                      {feedbackData.ratings[`question${index + 1}`] || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="sticky bottom-0 w-full p-4 bg-white border-t border-gray-200 mt-auto flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[rgb(37,78,235)] text-white hover:bg-[rgb(29,62,188)] transition-colors"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
