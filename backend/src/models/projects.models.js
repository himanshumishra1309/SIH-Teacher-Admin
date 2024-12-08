import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { DomainPoint } from "./domainpoints.models.js";

const projectSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    branch_name: {
      type: String,
      required: true,
      trim: true,
      enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    },
    daily_duration: {
      type: Number,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    addedOn: {
      type: Date,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Major", "Minor"],
    },
    report: {
      type: String, //cloudinary url
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

// Function to get points for a domain from the DomainPoint model
const getPointsForDomain = async (domain) => {
  const domainPoint = await DomainPoint.findOne({ domain });
  return domainPoint?.points || 0; // Default to 0 if the domain is not found
};

// Function to allocate points in the `Point` model
const allocatePoints = async (teacherId, domain, addedOn) => {
  const points = await getPointsForDomain(domain); // Fetch points for the domain

  // Search for an existing domain for the teacher
  const existingPoint = await Point.findOne({ owner: teacherId, domain });

  if (existingPoint) {
    // Update points if the domain exists
    await Point.findByIdAndUpdate(existingPoint._id, {
      $inc: { points },
    });
  } else {
    // Create a new domain if it does not exist
    await Point.create({
      date: addedOn || new Date(),
      points,
      domain,
      owner: teacherId,
    });
  }
};

// Post-save hook to allocate points
projectSchema.post("save", async function (doc) {
  const domain = `${doc.projectType} Projects`; // Generate the domain key (e.g., "Major Project")
  await allocatePoints(doc.owner, domain, doc.publicationDate);
});

// Post-remove hook to deduct points
projectSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const domain = `${doc.projectType} Projects`; // Generate the domain key (e.g., "Major Project")
    const points = await getPointsForDomain(domain); // Fetch points for the domain

    // Search for an existing domain for the teacher
    const existingPoint = await Point.findOne({ owner: doc.owner, domain });

    if (existingPoint) {
      // Deduct points
      await Point.findByIdAndUpdate(existingPoint._id, {
        $inc: { points: -points },
      });

      // Optionally, remove the document if points drop to 0
      if (existingPoint.points - points <= 0) {
        await Point.findByIdAndDelete(existingPoint._id);
      }
    }
  }
});

export const Project = mongoose.model("Project", projectSchema);
