import mongoose, { Schema } from 'mongoose';

const feedbackFormSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'AllocatedSubject',
      required: true,
    },
    releasedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const FeedbackForm = mongoose.model('FeedbackForm', feedbackFormSchema);