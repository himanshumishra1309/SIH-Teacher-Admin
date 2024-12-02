import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
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
patentSchema.post('save', async function (doc) {
  const domain = `${doc.patentType} Patent`; // Generate the domain key (e.g., "International Patent")
  await allocatePoints(doc.owner, domain, doc.publicationDate);
});

// Post-remove hook to deduct points
patentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      const domain = `${doc.patentType} Patent`; // Generate the domain key (e.g., "International Patent")
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

export const Patent = mongoose.model("Patent", patentSchema);