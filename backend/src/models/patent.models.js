import mongoose, { Schema } from "mongoose";
import { Graph } from "./graphs.models.js";
import { DomainPoint } from "./domainpoints.models.js";

const patentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    inventors: {
      type: String, // Store inventors as a single string (comma-separated if needed)
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    patentOffice: {
      type: String,
      enum: [
        "US", "EP", "JP", "WO", "AP", "EA", "OA", "AR", "CZ", "IE", "IN", "NL", "NZ",
        "VN", "ZA", "ZW", "MT", "MX", "TJ", "TW", "CN", "CU", "ID", "SG", "SK", "BG",
        "AT", "BA", "ES", "FR", "DE", "EE", "KE", "LT", "LV", "PT", "IL", "IT", "NO",
        "PH", "CH", "YU", "CS", "HK", "MW", "MY", "TR", "SU", "BR", "GB", "AU", "BE",
        "FI", "LU", "MC", "PL", "RO", "SE", "GR", "HR", "DZ", "GC", "MA", "MD", "RU",
        "ZM", "CY", "HU", "MN",
      ],
      required: true,
    },
    patentType: {
      type: String,
      enum: ["International", "National", "Regional"], // Define different patent categories
      required: true,
    },
    patentNumber: {
      type: String,
      required: true,
    },
    applicationNumber: {
      type: String,
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

// Function to calculate points based on patent type
const getPointsForPatentType = async (patentType) => {
  const domainPoint = await DomainPoint.findOne({ domain: patentType });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
patentSchema.post("save", async function (doc) {
  const points = await getPointsForPatentType(doc.patentType);

  await Graph.findOneAndUpdate(
    { owner: doc.owner, date: doc.publicationDate },
    { $inc: { points: points } },
    { upsert: true }
  );
});

// Post-remove hook to deduct points
patentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const points = await getPointsForPatentType(doc.patentType);

    await Graph.findOneAndUpdate(
      { owner: doc.owner, date: doc.publicationDate },
      { $inc: { points: -points } },
      { new: true }
    );
  }
});

export const Patent = mongoose.model("Patent", patentSchema);