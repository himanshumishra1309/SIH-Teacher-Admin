import mongoose, { Schema } from "mongoose";
import { Point } from './points.models.js';
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
    event_name: {
      type: String,
      required: true,
      trim: true,
    },
    event_type: {
      type: String,
      required: true,
      enum: ["National", "International", "State", "College"],
    },
    date: {
      type: Date,
      required: true,
    },
    report: {
      type: String, // Cloudinary URL
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

// Helper function to fetch points for the given domain
const getPointsForDomain = async (domain) => {
  const domainPoint = await DomainPoint.findOne({ domain });
  return domainPoint?.points || 0; // Default to 0 if no points are defined for the domain
};

// Function to allocate points in the `Point` model
const allocatePoints = async (teacherId, domain, date) => {
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
      date: date,
      points,
      domain,
      owner: teacherId,
    });
  }
};

// Post-save hook to allocate points
eventsParticipatedSchema.post("save", async function (doc) {
  const domain = `${doc.role} ${doc.event_type} Event`; // Generate the domain key (e.g., "Organizer National Event")
  await allocatePoints(doc.owner, domain, doc.date);
});

// Post-remove hook to deduct points
eventsParticipatedSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const domain = `${doc.role} ${doc.event_type} Event`; // Generate the domain key (e.g., "Organizer National Event")
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

export const EventParticipation = mongoose.model("EventParticipation", eventsParticipatedSchema);