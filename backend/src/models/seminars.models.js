import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { SeminarFeedback } from "./feedback-seminars.models.js";
import { DomainPoint } from "./domainpoints.models.js";

const seminarSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    report: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    feedbackReleased: {
      type: Boolean,
      default: false,
    },
    activeUntil: {
      type: Date, // Form availability period
    },
  },
  { timestamps: true }
);

// Helper function to retrieve points for a domain
const getPointsForDomain = async (domain) => {
  const domainPoint = await DomainPoint.findOne({ domain });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook: Allocate 1 point for seminar creation
seminarSchema.post("save", async function (doc) {
  const basePoints = await getPointsForDomain("Seminar");

  if (basePoints > 0) {
    await Point.create({
      date: doc.date, // Points allocated on seminar creation date
      points: basePoints,
      domain: "Seminar",
      owner: doc.owner,
    });
  }
});

// Middleware to handle feedbackReleased status based on activeUntil
seminarSchema.pre("save", function (next) {
  if (this.activeUntil < new Date()) {
    this.feedbackReleased = false;
  }
  next();
});

// Method to calculate and allocate feedback points
seminarSchema.methods.allocateFeedbackPoints = async function () {
  // Ensure feedbackReleased is false and activeUntil has passed
  if (!this.feedbackReleased && this.activeUntil < new Date()) {
    // Fetch all feedbacks for this seminar
    const feedbacks = await SeminarFeedback.find({ seminar: this._id });

    if (feedbacks.length > 0) {
      // Calculate average feedback rating
      const averageRating =
        feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;

      // Find the original seminar point document
      const seminarPoint = await Point.findOne({
        owner: this.owner,
        domain: "Seminar",
        date: this.date, // Ensure points are updated for the original seminar date
      });

      if (seminarPoint) {
        // Add feedback points to the existing document
        await Point.findByIdAndUpdate(
          seminarPoint._id,
          { $inc: { points: averageRating } }, // Add average feedback points
          { new: true }
        );
      }
    }
  }
};

// Post-remove hook: Handle point deletion on seminar deletion
seminarSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  // Delete seminar points
  await Point.deleteMany({
    owner: doc.owner,
    domain: "Seminar",
    date: doc.date, // Match seminar's creation date
  });

  // Optionally, handle any other cleanup like feedback deletion
  await SeminarFeedback.deleteMany({ seminar: doc._id });
});

export const Seminar = mongoose.model("Seminar", seminarSchema);