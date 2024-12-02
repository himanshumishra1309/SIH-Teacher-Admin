import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { DomainPoint } from "./domainpoints.models.js";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    pages: {
      type: String,
      required: true,
    },
    segregation: {
      type: String,
      enum: ["International", "National", "Regional"], // Segregation into levels
      required: true, // Ensures the type of book is defined
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true, // Mandatory field to link to the owner
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
const allocatePoints = async (teacherId, domain, publicationDate) => {
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
      date: publicationDate,
      points,
      domain,
      owner: teacherId,
    });
  }
};

// Post-save hook to allocate points
bookSchema.post("save", async function (doc) {
  const domain = `${doc.segregation} Book`; // Generate the domain key (e.g., "International Journal")
  await allocatePoints(doc.owner, domain, doc.publicationDate);
});

// Post-remove hook to deduct points
bookSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const domain = `${doc.segregation} Book`; // Generate the domain key (e.g., "International Journal")
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

export const Book = mongoose.model("Book", bookSchema);
