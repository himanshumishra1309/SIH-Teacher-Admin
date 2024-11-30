import mongoose, { Schema } from "mongoose";
import { Graph } from "./graphs.models.js";
import { DomainPoint } from './domainpoints.models.js';

const eventsParticipatedSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Organizer",
        "Speaker",
        "Judge",
        "Coordinator",
        "Volunteer",
        "Evaluator",
        "Panelist",
        "Mentor",
        "Session Chair",
        "Reviewer",
      ],
    },
    event: {
      type: String,
      required: true,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    report: {
      type: String, //cloudinary url
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

const getPointsForDomain = async (key) => {
  const domainPoint = await DomainPoint.findOne({ domain: key });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
eventsParticipatedSchema.post("save", async function (doc) {
  const points = await getPointsForDomain(doc.role); 
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.date },
    { $inc: { points: points } },
    { upsert: true }
  );
});

// Post-remove hook to deduct points
eventsParticipatedSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const points = await getPointsForDomain(doc.role);
    await Graph.findOneAndUpdate(
      { owner: doc.owner, date: doc.date },
      { $inc: { points: -points } },
      { new: true }
    );
  }
});

export const EventParticipation = mongoose.model(
  "EventParticipation",
  eventsParticipatedSchema
);
