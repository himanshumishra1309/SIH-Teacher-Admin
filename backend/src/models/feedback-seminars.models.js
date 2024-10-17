// models/feedback.model.js
import mongoose, { Schema } from 'mongoose';

const feedbackSeminarSchema = new Schema(
  {
    seminar: {
      type: Schema.Types.ObjectId,
      ref: "Seminar",
      required: true
    },
    rsvp: { // Reference to SeminarRSVP
      type: Schema.Types.ObjectId,
      ref: "SeminarRSVP",
      required: true
    },
    comments: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

// Prevent multiple feedback submissions from the same RSVP
feedbackSeminarSchema.index({ rsvp: 1 }, { unique: true });

export const SeminarFeedback = mongoose.model('SeminarFeedback', feedbackSeminarSchema);
