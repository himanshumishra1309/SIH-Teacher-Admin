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
import { useToast, toast } from "@/components/ui/hooks/use-toast";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  enrollmentNumber: z
    .string()
    .min(1, { message: "Enrollment Number is required" }),
  branch: z.string().min(1, { message: "Branch is required" }),
  rating: z.number().min(1, { message: "Please provide a rating" }),
  comment: z.string().optional(),
});

export default function SeminarFeedback() {
  const [studentData, setStudentData] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollmentNumber: "",
    branch: "",
    rating: 0,
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("studentAccessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          "http://localhost:6005/api/v1/students/me",
          { headers }
        );
        console.log("Student data fetched:", response.data);

        setStudentData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          enrollmentNumber: response.data.data.roll_no || "",
          branch: response.data.data.branch || "",
          // year: response.data.data.year || "", // Uncomment if you use year
          avatar: response.data.data.avatar || "", // Use the avatar URL if needed
        });

        // Set the form data with fetched student data
        setFormData((prevData) => ({
          ...prevData,
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          enrollmentNumber: response.data.data.roll_no || "",
          branch: response.data.data.branch || "",
        }));
      } catch (error) {
        console.error("Error fetching faculty data:", error);
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

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: null }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      formSchema.parse(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      setIsOpen(false);
      setFormData({
        name: "",
        email: "",
        enrollmentNumber: "",
        branch: "",
        rating: 0,
        comment: "",
      });
      setErrors({});
      setFeedbackSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
      setShowDialog(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowDialog(true); // Open the confirmation dialog
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(true)}
        className={feedbackSubmitted ? "bg-green-500 text-white" : "text-white"}
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              <form onSubmit={handleFormSubmit} className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
                  Send us your feedback
                </h2>
                {/* Form inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["name", "email", "enrollmentNumber", "branch"].map(
                    (field) => (
                      <div key={field}>
                        <label
                          htmlFor={field}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {field === "enrollmentNumber"
                            ? "Enrollment Number"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                          *
                        </label>
                        <Input
                          id={field}
                          name={field}
                          type={field === "email" ? "email" : "text"}
                          value={formData[field]}
                          onChange={handleInputChange}
                          className={`transition-all duration-300 ${
                            errors[field]
                              ? "border-red-500 dark:border-red-400 shake"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder={`Enter your ${
                            field === "enrollmentNumber"
                              ? "enrollment number"
                              : field
                          }`}
                        />
                        {errors[field] && (
                          <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                            {errors[field]}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
                {/* Rating */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating*
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.rating}
                    </p>
                  )}
                </div>
                {/* Comment */}
                <div className="mt-6">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Any other comment
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter any additional comments here"
                    className="transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 relative overflow-hidden group"
                  disabled={isSubmitting}
                >
                  <span
                    className={`transition-all duration-300 ${
                      isSubmitting ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Send Feedback
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

      {/* Confirmation Dialog */}
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
