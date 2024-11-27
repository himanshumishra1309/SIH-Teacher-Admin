// models/feedback.model.js
import mongoose, { Schema } from 'mongoose';

const feedbackSeminarSchema = new Schema(
  {
    seminar: {  
      type: Schema.Types.ObjectId,
      ref: "Seminar",
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
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
  },
  { timestamps: true }
);

// Prevent multiple feedback submissions from the same RSVP
feedbackSeminarSchema.index({ rsvp: 1 }, { unique: true });

export const SeminarFeedback = mongoose.model('SeminarFeedback', feedbackSeminarSchema);
