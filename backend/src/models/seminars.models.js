// models/seminar.model.js
import mongoose, { Schema } from "mongoose";
import { Graph } from "./graphs.models.js";
import { domainPoints } from "../utils/domainPoints.js";

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
    activeUntil:{
      type: Date,
    }
  },
  { timestamps: true }
);

// Post-save hook to add points
seminarSchema.post("save", async function (doc) {
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.date },
    { $inc: { points: domainPoints.Seminar } },
    { upsert: true }
  );
});

// Post-remove hook to deduct points
seminarSchema.post("findOneAndDelete", async function (doc) {
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.date },
    { $inc: { points: -domainPoints.Seminar } },
    { new: true }
  );
});

export const Seminar = mongoose.model("Seminar", seminarSchema);
