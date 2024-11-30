import mongoose, { Schema } from "mongoose";
import { Graph } from "./graphs.models.js";
import { DomainPoint } from "./domainpoints.models.js";

const sttpSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    dailyDuration: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    report: {
      type: String, // Cloudinary URL for the report
      required: true,
    },
    addedOn: {
      type: Date,
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

// Function to calculate points based on duration
const getPointsForSTTP = async (startDate, endDate) => {
  // Calculate the number of days by subtracting startDate from endDate
  const durationInDays = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  let durationKey = "";

  if (durationInDays === 1) {
    durationKey = "STTP_1_DAY";
  } else if (durationInDays >= 2 && durationInDays <= 3) {
    durationKey = "STTP_2_3_DAYS";
  } else if (durationInDays >= 4 && durationInDays <= 5) {
    durationKey = "STTP_4_5_DAYS";
  } else if (durationInDays === 7) {
    durationKey = "STTP_1_WEEK";
  } else if (durationInDays === 14) {
    durationKey = "STTP_2_WEEKS";
  } else if (durationInDays === 21) {
    durationKey = "STTP_3_WEEKS";
  } else if (durationInDays === 28) {
    durationKey = "STTP_4_WEEKS";
  } else {
    durationKey = "STTP_DEFAULT"; // Default key for unsupported durations
  }

  const domainPoint = await DomainPoint.findOne({ domain: durationKey });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
sttpSchema.post("save", async function (doc) {
  const points = await getPointsForSTTP(doc.startDate, doc.endDate);
  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.startDate },
    { $inc: { points: points } },
    { upsert: true }
  );
});

// Post-remove hook to deduct points
sttpSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const points = await getPointsForSTTP(doc.startDate, doc.endDate);
    await Graph.findOneAndUpdate(
      { owner: doc.owner, date: doc.startDate },
      { $inc: { points: -points } },
      { new: true }
    );
  }
});

export const STTP = mongoose.model("STTP", sttpSchema);
