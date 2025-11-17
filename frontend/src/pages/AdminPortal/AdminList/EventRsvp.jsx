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
  roll_no: z.string().min(1, { message: "Enrollment Number is required" }),
  branch: z.string().min(1, { message: "Branch is required" }),
  rating: z.number().min(1, { message: "Please provide a rating" }),
  comment: z.string().optional(),
});

export default function EventRsvp({ seminarId }) {
  // console.log(seminarId)
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll_no: "",
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

        setFormData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          roll_no: response.data.data.roll_no || "",
          branch: response.data.data.branch || "",
        });
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
      console.log("dkjfnndjfb");
      const accessToken = sessionStorage.getItem("studentAccessToken");

      const response = await axios.post(
        "http://localhost:6005/api/v1/seminars/seminars/rsvp",
        { seminarId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("RSVP response:", response.data);

      // Close the dialog with a delay to allow animation to complete
      setShowDialog(false);
      setTimeout(() => {
        setIsOpen(false); // Close the RSVP modal
      }, 300); // Adjust the timeout as necessary to match your animation duration

      setFormData({
        name: "",
        email: "",
        roll_no: "",
        branch: "",
        comment: "",
      });
      setErrors({});
      setFeedbackSubmitted(true);
      toast({
        title: "RSVP Successful",
        description: "You have successfully RSVPed for the seminar!",
        duration: 3000,
      });
    } catch (error) {
      if (error.response) {
        // If there is a response from the server
        console.error("Error response:", error.response.data);
        toast({
          title: "Error",
          description: error.response.data.message || "Something went wrong!",
          duration: 3000,
        });
      } else if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      } else {
        console.error("Error:", error.message);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
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
        {feedbackSubmitted ? "Registered" : "RSVP"}
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
                  Register For the Event
                </h2>
                {/* Form inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["name", "email", "roll_no", "branch"].map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={field}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {field === "roll_no"
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
                          field === "roll_no" ? "enrollment number" : field
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
