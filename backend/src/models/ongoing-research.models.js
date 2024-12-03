import mongoose, { Schema } from "mongoose";
import { DomainPoint } from "./domainpoints.models.js";
import { Point } from "./points.models.js";

const researchWorkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
    },
    funding: {
      type: Number,
      required: true,
    },
    fundingCategory: {
      type: String,
      enum: ["Above ₹10 Lakh", "Below ₹10 Lakh"],
      required: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher", // Reference to teacher(s) involved in the research
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, // Optional, in case the research is ongoing
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed"],
      default: "Ongoing",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

// Helper function to generate the domain key
const getResearchDomainKey = (fundingCategory, status) => {
  if (status === "Ongoing") {
    return fundingCategory === "Above ₹10 Lakh"
      ? "Ongoing Funded Above ₹10 Lakh Research"
      : "Ongoing Funded Below ₹10 Lakh Research";
  }
  return null; // No domain for "Completed" research
};

// Helper function to fetch points for a domain
const getPointsForResearchDomain = async (domain) => {
  const domainPoint = await DomainPoint.findOne({ domain });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Function to allocate points for research work
const allocatePointsForResearch = async (researchWork) => {
  const { fundingCategory, status, owner } = researchWork;
  const domainKey = getResearchDomainKey(fundingCategory, status);

  if (!domainKey) return;

  const points = await getPointsForResearchDomain(domainKey);

  if (points > 0) {
    // Check if points for this domain already exist
    const existingPoints = await Point.findOne({ owner, domain: domainKey });

    if (!existingPoints) {
      // Allocate points if not already allocated
      await Point.create({
        date: new Date(),
        points,
        domain: domainKey,
        owner,
      });
    }
  }
};

// Function to remove points when research work status changes or is deleted
const removeResearchPoints = async (researchWork) => {
  const { fundingCategory, status, owner } = researchWork;
  const domainKey = getResearchDomainKey(fundingCategory, status);

  if (!domainKey) return;

  const points = await getPointsForResearchDomain(domainKey);

  if (points > 0) {
    const existingPoints = await Point.findOne({ owner, domain: domainKey });
    if (existingPoints) {
      const newPoints = existingPoints.points - points;
      if (newPoints <= 0) {
        // Remove the points entry if it drops to 0
        await Point.findByIdAndDelete(existingPoints._id);
      } else {
        // Update points
        await Point.findByIdAndUpdate(existingPoints._id, { points: newPoints });
      }
    }
  }
};

// Pre-update hook to handle status changes
researchWorkSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const docToUpdate = await this.model.findOne(this.getQuery());

  if (docToUpdate && update.status === "Completed" && docToUpdate.status !== "Completed") {
    // If status changes to "Completed," remove the points
    await removeResearchPoints(docToUpdate);
  }

  next();
});

// Post-save hook for allocating points
researchWorkSchema.post("save", async function (doc) {
  await allocatePointsForResearch(doc);
});

// Post-remove hook for deducting points
researchWorkSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await removeResearchPoints(doc);
  }
});

export const ResearchWork = mongoose.model("ResearchWork", researchWorkSchema);