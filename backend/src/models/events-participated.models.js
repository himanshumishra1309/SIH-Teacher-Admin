import mongoose, { Schema } from "mongoose";
import { Graph } from "./graphs.models.js";
import { domainPoints } from "../utils/domainPoints.js";

const eventsParticipatedSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
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

// Post-save hook to add points
eventsParticipatedSchema.post("save", async function (doc) {
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.date },
    { $inc: { points: domainPoints.EventParticipation } },
    { upsert: true }
  );
});

// Post-remove hook to deduct points
eventsParticipatedSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Graph.findOneAndUpdate(
      { owner: doc.owner, date: doc.date },
      { $inc: { points: -domainPoints.EventParticipation } },
      { new: true }
    );
  }
});

export const EventParticipation = mongoose.model(
  "EventParticipation",
  eventsParticipatedSchema
);
