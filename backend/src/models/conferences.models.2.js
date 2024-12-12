import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { DomainPoint } from "./domainpoints.models.js";
import { PublicationPoint } from "./publication-points.models.js";

const conferenceSchema = new Schema(
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
    conference: {
      type: String, // Name of the conference
      required: true,
    },
    volume: {
      type: Number,
      required: false,
    },
    issue: {
      type: Number,
      required: false,
    },
    pages: {
      type: String, // To include page range like "123-134"
      required: false,
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
conferenceSchema.post("save", async function (doc) {
  await allocatePublicationPoints(doc.owner, doc.publication);
});

// Post-remove hook to deduct points based on publication hindex
conferenceSchema.post("findOneAndDelete", async function (doc) {
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
// const getPointsForDomain = async (domain) => {
//   const domainPoint = await DomainPoint.findOne({ domain });
//   return domainPoint?.points || 0; // Default to 0 if the domain is not found
// };

// // Function to allocate points in the `Point` model
// const allocatePoints = async (teacherId, domain, publicationDate) => {
//   const points = await getPointsForDomain(domain); // Fetch points for the domain

//   // Search for an existing domain for the teacher
//   const existingPoint = await Point.findOne({ owner: teacherId, domain });

//   if (existingPoint) {
//     // Update points if the domain exists
//     await Point.findByIdAndUpdate(existingPoint._id, {
//       $inc: { points },
//     });
//   } else {
//     // Create a new domain if it does not exist
//     await Point.create({
//       date: publicationDate,
//       points,
//       domain,
//       owner: teacherId,
//     });
//   }
// };

// // Post-save hook to allocate points
// conferenceSchema.post("save", async function (doc) {
//   const domain = `${doc.conferenceType} Conference`; // Generate the domain key (e.g., "International Conference")
//   await allocatePoints(doc.owner, domain, doc.publicationDate);
// });

// // Post-remove hook to deduct points
// conferenceSchema.post("findOneAndDelete", async function (doc) {
//   if (doc) {
//     const domain = `${doc.conferenceType} Conference`; // Generate the domain key (e.g., "International Conference")
//     const points = await getPointsForDomain(domain); // Fetch points for the domain

//     // Search for an existing domain for the teacher
//     const existingPoint = await Point.findOne({ owner: doc.owner, domain });

//     if (existingPoint) {
//       // Deduct points
//       await Point.findByIdAndUpdate(existingPoint._id, {
//         $inc: { points: -points },
//       });

//       // Optionally, remove the document if points drop to 0
//       if (existingPoint.points - points <= 0) {
//         await Point.findByIdAndDelete(existingPoint._id);
//       }
//     }
//   }
// });

export const Conference2 = mongoose.model("Conference2", conferenceSchema);
