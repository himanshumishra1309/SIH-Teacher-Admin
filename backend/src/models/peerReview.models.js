import mongoose, { Schema } from "mongoose";

const peerReviewSchema = new Schema(
  {
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: "Teacher", // The person being reviewed (e.g., a teacher or peer)
      required: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "Teacher", // The person providing the review
      required: true,
    },
    question1_rating:{
      type: Number,
      required: true,
    },
    question2_rating:{
      type: Number,
      required: true,
    },
    question3_rating:{
      type: Number,
      required: true,
    },
    question4_rating:{
      type: Number,
      required: true,
    },
    question5_rating:{
      type: Number,
      required: true,
    },
    question6_rating:{
      type: Number,
      required: true,
    },
    question7_rating:{
      type: Number,
      required: true,
    },
    question8_rating:{
      type: Number,
      required: true,
    },
    question9_rating:{
      type: Number,
      required: true,
    },
    question10_rating:{
      type: Number,
      required: true,
    },
    feedback: {
      type: String, // Feedback or comments provided by the reviewer
      required: true,
      trim: true,
    },
    submissionTime: {
      type: Date, 
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin", // Admin or authority managing the peer review process
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate the total score
peerReviewSchema.pre("save", function (next) {
  if (this.scores && this.scores.criteria) {
    const totalScore = this.scores.criteria.reduce((sum, criterion) => sum + criterion.score, 0);
    this.scores.totalScore = totalScore;
  }
  next();
});

export const PeerReview = mongoose.model("PeerReview", peerReviewSchema);