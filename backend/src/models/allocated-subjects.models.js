import mongoose, { Schema } from "mongoose";
import { DomainPoint } from "./domainpoints.models.js";
import { Point } from "./points.models.js";
import { Lecture } from "./lectures.models.js";
import { LectureFeedback } from "./lectureFeedbacks.models.js"; // Assuming this model exists

const allocatedSubjectSchema = new Schema(
  {
    subject_name: {
      type: String,
      trim: true,
      required: true,
    },
    subject_code: {
      type: String,
      required: true,
    },
    subject_credit: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "EXTC", "EE", "ME", "CE"],
    },
    year: {
      type: String,
      required: true,
      enum: ["First", "Second", "Third", "Fourth"],
    },
    type: {
      type: String,
      enum: ["Theory", "Practical"], // Theory or Practical
      required: true,
    },
    min_lectures: {
      type: Number,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      index: true,
      required: true,
    },
    feedbackReleased: {
      type: Boolean,
      default: false, // Initially false
    },
    activeUntil: {
      type: Date, // Time until feedback remains active
    },
  },
  { timestamps: true }
);

// Helper function to generate the domain key (e.g., "4-Theory" or "3-Practical")
const getDomainKey = (subject_credit, type) => {
  return `${subject_credit}-${type}`;
};

// Helper function to fetch points based on the generated key
const getPointsForDomain = async (key) => {
  const domainPoint = await DomainPoint.findOne({ domain: key });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Function to check and allocate points after minimum lectures are completed
const allocatePointsIfEligible = async (subjectId) => {
  const allocatedSubject = await AllocatedSubject.findById(subjectId);

  if (!allocatedSubject) {
    console.error("Subject not found:", subjectId);
    return;
  }

  const { min_lectures, subject_credit, teacher, type } = allocatedSubject;
  const domainKey = getDomainKey(subject_credit, type);

  // Count the number of lectures completed for this subject
  const lectureCount = await Lecture.countDocuments({ subject: subjectId });

  if (lectureCount >= min_lectures) {
    const points = await getPointsForDomain(domainKey); // Points for completing the minimum lectures

    // Check if points already exist for the subject domain
    const existingPoints = await Point.findOne({
      owner: teacher,
      domain: domainKey,
    });

    if (!existingPoints) {
      // Create points if not already allocated
      await Point.create({
        date: new Date(), // Current date for points allocation
        points: points,
        domain: domainKey,
        owner: teacher,
      });
    }
  }
};

// Function to process feedback and allocate points
const processFeedback = async (doc) => {
  if (
    doc.feedbackReleased &&
    doc.activeUntil &&
    doc.activeUntil <= new Date()
  ) {
    const feedbacks = await LectureFeedback.find({
      subject_code: doc.subject_code,
      teacher: doc.teacher,
      submissionTime: { $lte: doc.activeUntil },
    });

    if (feedbacks.length > 0) {
      const totalAverageRating = feedbacks.reduce((sum, feedback) => {
        const feedbackAverage =
          (feedback.question1_rating +
            feedback.question2_rating +
            feedback.question3_rating +
            feedback.question4_rating +
            feedback.question5_rating +
            feedback.question6_rating +
            feedback.question7_rating +
            feedback.question8_rating +
            feedback.question9_rating +
            feedback.question10_rating) /
          10;
        return sum + feedbackAverage;
      }, 0);

      const averageRating = totalAverageRating / feedbacks.length;

      const domainKey = getDomainKey(doc.subject_credit, doc.type);
      const feedbackPoints = averageRating; // Feedback points are now directly the average rating

      // Update teacher's points
      const existingPoints = await Point.findOne({
        owner: doc.teacher,
        domain: domainKey,
      });
      if (existingPoints) {
        await Point.findByIdAndUpdate(existingPoints._id, {
          $inc: { points: feedbackPoints },
        });
      } else {
        await Point.create({
          date: new Date(),
          points: feedbackPoints,
          domain: domainKey,
          owner: doc.teacher,
        });
      }
    }

    // Reset feedback fields
    doc.feedbackReleased = false;
    doc.activeUntil = null;
    await doc.save();
  }
};

// Post-save hook to check and allocate points
allocatedSubjectSchema.post("save", async function (doc) {
  await allocatePointsIfEligible(doc._id);
  await processFeedback(doc); // Process feedback
});

// Post-remove hook to deduct points if allocated
allocatedSubjectSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const domainKey = getDomainKey(doc.subject_credit, doc.type);
    const points = await getPointsForDomain(domainKey);

    const existingPoints = await Point.findOne({
      owner: doc.teacher,
      domain: domainKey,
    });

    if (existingPoints) {
      // Deduct points and remove the points entry if points drop to 0
      const newPoints = existingPoints.points - points;
      if (newPoints <= 0) {
        await Point.findByIdAndDelete(existingPoints._id);
      } else {
        await Point.findByIdAndUpdate(existingPoints._id, {
          points: newPoints,
        });
      }
    }
  }
});

export const AllocatedSubject = mongoose.model(
  "AllocatedSubject",
  allocatedSubjectSchema
);
