import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { PublicationPoint } from "./publication-points.models.js";

const book2Schema = new Schema(
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
    publication: {
      type: Schema.Types.ObjectId,
      ref: "PublicationPoint",
    },
    h5_index: {
      type: Number,
      required: false,
    },
    h5_median: {
      type: Number,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

// Function to allocate points in the `Point` model based on publication hindex
const allocatePublicationPoints = async (teacherId, publicationId) => {
  const publication = await PublicationPoint.findById(publicationId);
  if (!publication) {
    throw new Error("Publication not found");
  }

  const points = (publication.hindex)/100; // Use hindex as the points value

  // Search for an existing point entry for the teacher
  const existingPoint = await Point.findOne({ owner: teacherId, domain: publication.name });

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
book2Schema.post("save", async function (doc) {
  await allocatePublicationPoints(doc.owner, doc.publication);
});

// Post-remove hook to deduct points based on publication hindex
book2Schema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const publication = await PublicationPoint.findById(doc.publication);
    // console.log(publication);
    if (!publication) {
      throw new Error("Publication not found");
    }

    const points = (publication.hindex)/100; // Use hindex as the points value

    // Search for an existing point entry for the teacher
    const existingPoint = await Point.findOne({ owner: doc.owner, domain: publication.name });

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

export const Book2 = mongoose.model("Book2", book2Schema);