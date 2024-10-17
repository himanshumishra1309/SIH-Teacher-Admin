// models/rsvp.model.js
import mongoose, { Schema } from 'mongoose';

const rsvpSeminarSchema = new Schema(
  {
    seminar: {
      type: Schema.Types.ObjectId,
      ref: "Seminar",
      required: true
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    submittedFeedback: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Prevent duplicate RSVPs for the same seminar by the same student
rsvpSeminarSchema.index({ seminar: 1, student: 1 }, { unique: true });

export const SeminarRSVP = mongoose.model('SeminarRSVP', rsvpSeminarSchema);
