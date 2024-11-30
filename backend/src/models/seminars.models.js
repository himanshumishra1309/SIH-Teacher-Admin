import mongoose, { Schema } from "mongoose";
import { Graph } from "./graphs.models.js";
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

// Post-save hook: Allocate 1 point for adding a seminar
seminarSchema.post("save", async function (doc) {
  const basePoints = await getPointsForDomain("Seminar");
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.date },
    { $inc: { points: basePoints } },
    { upsert: true }
  );
});

// Post-remove hook: Deduct points when seminar is removed
seminarSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  const basePoints = await getPointsForDomain("Seminar");

  // Deduct the base points for the seminar
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.date },
    { $inc: { points: -basePoints } },
    { new: true }
  );

  // Fetch all feedback related to the seminar
  const feedbacks = await SeminarFeedback.find({ seminar: doc._id });

  if (feedbacks.length > 0) {
    // Calculate the average feedback rating
    const averageRating =
      feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;

    // Deduct the feedback points (average rating) from the graph
    await Graph.findOneAndUpdate(
      { owner: doc.owner, date: doc.date },
      { $inc: { points: -averageRating } },
      { new: true }
    );
  }
});

// Method to allocate points based on feedback after the form is filled
seminarSchema.methods.allocateFeedbackPoints = async function () {
  if (this.feedbackReleased && this.activeUntil < new Date()) {
    // Fetch all feedback for the seminar
    const feedbacks = await SeminarFeedback.find({ seminar: this._id });

    if (feedbacks.length > 0) {
      // Calculate average rating
      const averageRating =
        feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;

      // Add average rating as points to the teacher's graph
      await Graph.findOneAndUpdate(
        { owner: this.owner, date: this.date },
        { $inc: { points: averageRating } },
        { upsert: true }
      );
    }
  }
};

export const Seminar = mongoose.model("Seminar", seminarSchema);