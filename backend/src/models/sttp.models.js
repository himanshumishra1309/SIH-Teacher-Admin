import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
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

// Helper function to calculate the domain key for points
const getSTTPDomainKey = (startDate, endDate) => {
  const durationInDays = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  if (durationInDays === 1) return "STTP_1_DAY";
  if (durationInDays >= 2 && durationInDays <= 3) return "STTP_2_3_DAYS";
  if (durationInDays >= 4 && durationInDays <= 5) return "STTP_4_5_DAYS";
  if (durationInDays === 7) return "STTP_1_WEEK";
  if (durationInDays === 14) return "STTP_2_WEEKS";
  if (durationInDays === 21) return "STTP_3_WEEKS";
  if (durationInDays === 28) return "STTP_4_WEEKS";
  return "STTP_DEFAULT"; // Default key for unsupported durations
};

// Function to fetch points for a domain key
const getPointsForSTTP = async (domainKey) => {
  const domainPoint = await DomainPoint.findOne({ domain: domainKey });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
sttpSchema.post("save", async function (doc) {
  const domainKey = getSTTPDomainKey(doc.startDate, doc.endDate);
  const points = await getPointsForSTTP(domainKey);

  if (points > 0) {
    await Point.create({
      date: doc.addedOn,
      points: points,
      domain: domainKey,
      owner: doc.owner,
    });
  }
});

// Post-remove hook to deduct points
sttpSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const domainKey = getSTTPDomainKey(doc.startDate, doc.endDate);
    const points = await getPointsForSTTP(domainKey);

    if (points > 0) {
      const existingPoint = await Point.findOne({ owner: doc.owner, domain: domainKey });

      if (existingPoint) {
        await Point.findByIdAndUpdate(
          existingPoint._id,
          { $inc: { points: -points } },
          { new: true }
        );

        // Optionally, remove the document if points drop to 0
        if (existingPoint.points - points <= 0) {
          await Point.findByIdAndDelete(existingPoint._id);
        }
      }
    }
  }
});

export const STTP = mongoose.model("STTP", sttpSchema);
