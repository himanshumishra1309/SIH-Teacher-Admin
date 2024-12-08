"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { X, Loader2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "../../components/ui/hooks/use-toast";
import { Label } from "@/components/ui/label";
import axios from "axios";

const peerReviewCriteria = [
    "Does the faculty demonstrate thorough knowledge and expertise in their subject area?",
    "How innovative are the teaching methods employed by the faculty (e.g., use of technology, group activities, flipped classrooms)?",
    "Is the faculty approachable and cooperative in collaborative academic and administrative tasks?",
    "Does the faculty actively participate in institutional development initiatives (e.g., organizing events, academic audits)?",
    "How do you evaluate the quality and relevance of the faculty's research and publications?",
    "Does the faculty consistently provide support and mentorship to students outside the classroom?",
    "Does the faculty exhibit high standards of ethics and professionalism in their conduct?",
    "How efficiently does the faculty manage their administrative responsibilities (if applicable)?",
    "Is the faculty open to constructive feedback and eager to improve their teaching or research practices?",
    "How would you rate the faculty's overall contribution to the department and institution?"
  ];
  

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  roll_no: z.string().min(1, { message: "Employee Code is required" }),
  branch: z.string().min(1, { message: "Department is required" }),
  ratings: z.array(z.number().min(1).max(5)).length(peerReviewCriteria.length),
  comment: z.string().optional(),
});

function StarRating({ rating, onRatingChange }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer transition-all duration-200 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
}

export default function PeerReviewFeedback({
  teacherId,
  subject_credit,
  subject_name,
  subject_code,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employee_code: "",
    branch: "",
    ratings: new Array(feedbackCriteria.length).fill(0),
    teacherIdId: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("teacherAccessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          "https.facultyappraisal.software/api/v1/",
          { headers }
        );
        // console.log("Student data fetched:", response.data);

        setFormData((prev) => ({
          ...prev,
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          employee_code: response.data.data.employee_code || "",
          department: response.data.data.department || "",
        }));
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRatingChange = (index, rating) => {
    setFormData((prev) => {
      const newRatings = [...prev.ratings];
      newRatings[index] = rating;
      return { ...prev, ratings: newRatings };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      formSchema.parse(formData);
      const feedbackData = {
        subject_name: subject_name || "",
        employee_code: employee_code || "",
        // subject_credit: subject_credit || 0,
        teacher: teacherId || "",
        question1_rating: formData.ratings[0] || 0,
        question2_rating: formData.ratings[1] || 0,
        question3_rating: formData.ratings[2] || 0,
        question4_rating: formData.ratings[3] || 0,
        question5_rating: formData.ratings[4] || 0,
        question6_rating: formData.ratings[5] || 0,
        question7_rating: formData.ratings[6] || 0,
        question8_rating: formData.ratings[7] || 0,
        question9_rating: formData.ratings[8] || 0,
        question10_rating: formData.ratings[9] || 0,
        comments: formData.comment || "",
      };

      const accessToken = sessionStorage.getItem("teacherAccessToken");
      if (!accessToken) {
        throw new Error("You are not authenticated");
      }

      // Send the feedback to the backend
      const response = await axios.post(
        "https.facultyappraisal.software/api/v1/students/fillfeedBackForm",
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDialog(false);
      console.log("Feedback submitted:", response);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your detailed feedback!",
        duration: 3000,
      });
      setIsSubmitting(false);
      setFeedbackSubmitted(true);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);

      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
        toast({
          title: "Error",
          description: "Please fill in all mandatory fields.",
          duration: 3000,
          variant: "destructive",
        });
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to submit feedback. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          duration: 3000,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.ratings.some((rating) => rating === 0)) {
      toast({
        title: "Error",
        description: "Please provide ratings for all criteria.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    setShowDialog(true);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(true)}
        className={`${
          feedbackSubmitted
            ? "bg-green-500 text-white"
            : "bg-blue-600 text-white"
        } px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300`}
      >
        {feedbackSubmitted ? "Feedback Submitted" : "Give Feedback"}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] relative overflow-hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>

              <form
                onSubmit={handleFormSubmit}
                className="p-8 h-full overflow-y-auto space-y-6"
              >
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                  Faculty Feedback Form
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 text-center">
                  Your feedback is valuable in maintaining and improving the
                  quality of instruction. Please rate the following criteria on
                  a scale of 1-5 stars.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {["name", "email", "roll_no", "branch"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-sm font-semibold">
                        {field === "roll_no"
                          ? "Enrollment Number"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        type={field === "email" ? "email" : "text"}
                        value={formData[field]}
                        onChange={handleInputChange}
                        readOnly
                        className={`w-full p-3 border rounded-lg shadow-sm transition-all duration-300 ${
                          errors[field]
                            ? "border-red-500 dark:border-red-400"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {errors[field] && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {feedbackCriteria.map((criterion, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 pb-4"
                    >
                      <Label className="mb-2 block text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {criterion}
                      </Label>
                      <StarRating
                        rating={formData.ratings[index]}
                        onRatingChange={(rating) =>
                          handleRatingChange(index, rating)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Label
                    htmlFor="comment"
                    className="mb-1 block text-lg font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Additional Comments
                  </Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please provide any additional feedback or suggestions"
                    className="w-full p-3 border rounded-lg shadow-sm transition-all duration-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 relative overflow-hidden group bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  <span
                    className={`transition-all duration-300 ${
                      isSubmitting ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Submit Feedback
                  </span>
                  {isSubmitting && (
                    <Loader2 className="h-5 w-5 animate-spin absolute inset-0 m-auto" />
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Confirm Submission</h2>
            <p>Are you sure you want to submit this feedback?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Yes, Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
