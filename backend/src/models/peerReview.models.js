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
    subjectOrProject: {
      type: String, // Subject or project being reviewed
      required: true,
      trim: true,
    },
    feedback: {
      type: String, // Feedback or comments provided by the reviewer
      required: true,
      trim: true,
    },
    reviewDate: {
      type: Date, // Date when the review was completed
    },
    reviewedOnTime: {
      type: Boolean, // Whether the review was submitted on time
      default: true,
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