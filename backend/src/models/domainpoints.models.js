import mongoose, { Schema } from 'mongoose';

const domainPointSchema = new Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g., 'InternationalJournal', 'NationalJournal'
    },
    points: {
      type: Number,
      required: true, // e.g., 4 for InternationalJournal
      min: 0,
    },
  },
  { timestamps: true }
);

export const DomainPoint = mongoose.model('DomainPoint', domainPointSchema);
