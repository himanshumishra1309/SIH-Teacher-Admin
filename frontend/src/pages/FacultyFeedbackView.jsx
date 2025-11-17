import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FeedbackSubmitterTable from "./UpcomingSeminars/feedbackSubmitterTable";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DetailedFeedbackView } from "./UpcomingSeminars/DetailedFeedbackView";

export default function FacultyFeedbackView({ feedback, onClose, isOpen, subjectId }) {
  if (!isOpen) return null;
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [averageRating, setAverageRating] = useState(4.2);

  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const updatePost = async () => {
      try {
        const teacherAccessToken = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.post(
          `http://localhost:6005/api/v1/lec-feedback/cards`,
          {
            subject_name: feedback.subject_name,
            subject_code: feedback.subject_code,
            subject_credit: feedback.subject_credit,
            year: feedback.year,
            branch: feedback.branch,
            teacherId: feedback.teacher,
          },
          {
            headers: {
              Authorization: `Bearer ${teacherAccessToken}`,
            },
          }
        );
        console.log(response.data.data);
        setData(response.data.data);

        const ratings = response.data.data.map((item) => item.averageRating); // Assuming `rating` is the field in each feedback
        const avgRating =
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

        setAverageRating(avgRating);
      } catch (error) {
        console.error("Error updating the post:", error);
      }
    };
    updatePost();
  }, [feedback]);

  const [isSubmittersModalOpen, setIsSubmittersModalOpen] = useState(false);
  const [isDetailedFeedbackModalOpen, setIsDetailedFeedbackModalOpen] =
    useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="sr-only">Close</span>
        </button>

        <Button
          onClick={() => setIsSubmittersModalOpen(true)}
          className="absolute top-4 right-16 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Submitters Count
        </Button>
        <div className="flex h-full">
          {/* Left Side - Rating Overview */}
          <div className="w-1/3 border-r border-gray-200 p-6 bg-blue-50">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Overall Rating
            </h2>
            <div className="text-center">
              {data.length > 0 ? (
                <>
                  <div className="text-5xl font-bold text-blue-900 mb-4">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 ${
                          star <= Math.round(averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-blue-700">Based on student feedback</p>
                </>
              ) : (
                <p className="text-xl text-blue-900">No feedback received</p>
              )}
            </div>
          </div>

          {/* Right Side - Feedback Cards */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">
                Student Feedback
              </h2>
            </div>
            <ScrollArea className="h-[calc(80vh-120px)]">
              {data.length > 0 ? (
                <div className="space-y-4 pr-4">
                  {data.map((feedback, index) => (
                    <Card
                      key={index}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.averageRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(
                            feedback.submissionTime
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{feedback.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {feedback.studentName}
                      </p>
                      <Button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="bg-[rgb(37,99,235)] text-white hover:bg-[rgb(29,78,216)] transition-colors mt-2"
                      >
                        View Detailed Rating
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No feedback received
                </p>
              )}
            </ScrollArea>
          </div>
        </div>

        {isSubmittersModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] overflow-hidden relative">
              <button
                onClick={() => setIsSubmittersModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Feexdback Submitters
                </h2>
                <FeedbackSubmitterTable feedback={feedback} subjectId = {subjectId} />
              </div>
            </div>
          </div>
        )}
        <DetailedFeedbackView
          isOpen={!!selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          feedback={selectedFeedback}
        />
        <div className="sticky bottom-0 w-full p-4 bg-white border-t border-gray-200 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[rgb(37,99,235)] text-white hover:bg-[rgb(29,78,216)] transition-colors"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
