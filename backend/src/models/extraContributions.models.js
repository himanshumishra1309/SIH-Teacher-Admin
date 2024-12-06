import mongoose, { Schema } from "mongoose";
// import { DomainPoint } from "./domainpoints.models";
import { Point } from "./points.models.js";
// import { domainPoints } from "../utils/domainPoints.js";
import { DomainPoint } from "./domainpoints.models.js";

const contributionsSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    report: {
      type: String,
    },
    contributionType: {
      type: String,
      required: true,
      enum: [
        "Industrial Visit",
        "Wookshop Conducted",
        "Extra Course Studied",
        "Made Study Materials",
        "Miscellaneous",
      ],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

// Helper function to map contribution type to domain
const mapContributionTypeToDomain = (type) => {
  const mapping = {
    "Industrial Visit": "Industrial-Visit-Other",
    "Workshop Conducted": "Workshop-Conducted-Other",
    "Extra Course Studied": "Extra-Course-Studied-Other",
    "Made Study Materials": "Made-Study-Materials-Other",
    "Miscellaneous": "Miscellaneous",
  };
  return mapping[type] || "Miscellaneous";
};

// Pre-save hook to allocate points
contributionsSchema.pre("save", async function (next) {
  if (this.isNew) {
    const domain = mapContributionTypeToDomain(this.contributionType);
    const domainPoint = await DomainPoint.findOne({ domain });

    if (domainPoint) {
      await Point.create({
        date: new Date(),
        points: domainPoint.points,
        domain: domain,
        owner: this.owner,
      });
    }
  }
  next();
});

// Post-remove hook to remove allocated points
contributionsSchema.post("remove", async function (doc) {
  const domain = mapContributionTypeToDomain(doc.contributionType);
  await Point.findOneAndDelete({ owner: doc.owner, domain: domain });
});

export const Contribution = mongoose.model("Contribution", contributionsSchema);
