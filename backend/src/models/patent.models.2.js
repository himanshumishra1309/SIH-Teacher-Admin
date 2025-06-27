import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { DomainPoint } from "./domainpoints.models.js";
import { PublicationPoint } from "./publication-points.models.js";

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
        "US",
        "EP",
        "JP",
        "WO",
        "AP",
        "EA",
        "OA",
        "AR",
        "CZ",
        "IE",
        "IN",
        "NL",
        "NZ",
        "VN",
        "ZA",
        "ZW",
        "MT",
        "MX",
        "TJ",
        "TW",
        "CN",
        "CU",
        "ID",
        "SG",
        "SK",
        "BG",
        "AT",
        "BA",
        "ES",
        "FR",
        "DE",
        "EE",
        "KE",
        "LT",
        "LV",
        "PT",
        "IL",
        "IT",
        "NO",
        "PH",
        "CH",
        "YU",
        "CS",
        "HK",
        "MW",
        "MY",
        "TR",
        "SU",
        "BR",
        "GB",
        "AU",
        "BE",
        "FI",
        "LU",
        "MC",
        "PL",
        "RO",
        "SE",
        "GR",
        "HR",
        "DZ",
        "GC",
        "MA",
        "MD",
        "RU",
        "ZM",
        "CY",
        "HU",
        "MN",
      ],
      required: true,
    },
    publication: {
      type: String,
      required: true,
    },
    h5_index: {
      type: Number,
      required: false,
    },
    h5_median: {
      type: Number,
      required: false,
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
const allocatePublicationPoints = async (teacherId, publicationId) => {
  const publication = await PublicationPoint.findById(publicationId);
  if (!publication) {
    throw new Error("Publication not found");
  }

  const points = publication.hindex / 100; // Use hindex as the points value

  // Search for an existing point entry for the teacher
  const existingPoint = await Point.findOne({
    owner: teacherId,
    domain: publication.name,
  });

  if (existingPoint) {
    // Update points if the domain exists
    await Point.findByIdAndUpdate(existingPoint._id, {
      $inc: { points },
    });
  } else {
    // Create a new point entry if it does not exist
    await Point.create({
      date: new Date(),
      points,
      domain: `${publication.name} (book)`,
      owner: teacherId,
    });
  }
};

// Post-save hook to allocate points based on publication hindex
patentSchema.post("save", async function (doc) {
  await allocatePublicationPoints(doc.owner, doc.publication);
});

// Post-remove hook to deduct points based on publication hindex
patentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const publication = await PublicationPoint.findById(doc.publication);
    // console.log(publication);
    if (!publication) {
      throw new Error("Publication not found");
    }

    const points = publication.hindex / 100; // Use hindex as the points value

    // Search for an existing point entry for the teacher
    const existingPoint = await Point.findOne({
      owner: doc.owner,
      domain: publication.name,
    });

    console.log(existingPoint);

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

export const Patent2 = mongoose.model("Patent2", patentSchema);
