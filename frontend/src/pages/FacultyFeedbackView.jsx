import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import FeedbackSubmitterTable from "./UpcomingSeminars/feedbackSubmitterTable";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FacultyFeedbackView({ feedback, onClose, isOpen }) {
  if (!isOpen) return null;
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [averageRating, setAverageRating] = useState(4.2);

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

  // Mock data - replace with actual data from the feedback prop
  const feedbackData = [
    {
      studentName: "Anonymous Student",
      rating: 4,
      comment:
        "Excellent teaching methodology and very helpful in clearing doubts.",
      date: "2024-01-15",
    },
    {
      studentName: "Anonymous Student",
      rating: 5,
      comment: "The professor made complex topics easy to understand.",
      date: "2024-01-14",
    },
    // Add more feedback items as needed
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center mt-40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>
        <Button
          onClick={() => setIsSubmittersModalOpen(true)}
          className="absolute top-4 right-16 bg-blue-500 hover:bg-blue-600 text-white"
        >
          View Submitters
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
                          {new Date(feedback.submissionTime).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{feedback.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {feedback.studentName}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-4">No feedback received</p>
              )}
            </ScrollArea>
          </div>
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
                Feedback Submitters
              </h2>
              <FeedbackSubmitterTable feedback={feedback} />
              <p className="text-gray-600">
                Submitters table will be displayed here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

