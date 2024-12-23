import mongoose, { Schema } from "mongoose";
import { AllocatedSubject } from "./allocated-subjects.models.js";
import { DomainPoint } from "./domainpoints.models.js";
import { Point } from "./points.models.js";

const lectureSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "AllocatedSubject",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
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

// Helper function to get points for a domain
const getPointsForDomain = async (domain) => {
  const domainPoint = await DomainPoint.findOne({ domain });
  return domainPoint?.points || 0;
};

// Post-save hook to allocate domain points when reaching the minimum lectures
lectureSchema.post("save", async function (doc) {
  const allocatedSubject = await AllocatedSubject.findById(doc.subject);

  if (!allocatedSubject) {
    console.error("Subject not found for lecture:", doc.subject);
    return;
  }

  const { min_lectures, subject_credit, teacher, type } = allocatedSubject;
  const lectureCount = await Lecture.countDocuments({ subject: doc.subject });
  const domainKey = `${subject_credit}-${type}`;
  const domainPoints = await getPointsForDomain(domainKey);

  if (!domainPoints) {
    console.error("Domain points not found for:", domainKey);
    return;
  }

  const points = await Point.findOne({ owner: teacher, domain: domainKey });

  if (lectureCount === min_lectures) {
    // Add domain points when minimum lectures are reached
    if (points) {
      await Point.findByIdAndUpdate(points._id, { $inc: { points: domainPoints } });
    } else {
      await Point.create({
        date: new Date(),
        points: domainPoints,
        domain: domainKey,
        owner: teacher,
      });
    }
  } else if (lectureCount > min_lectures) {
    // Add extra lecture points (10% of domain points per extra lecture)
    const extraPoints = domainPoints * 0.1;
    if (points) {
      await Point.findByIdAndUpdate(points._id, { $inc: { points: extraPoints } });
    } else {
      await Point.create({
        date: new Date(),
        points: extraPoints,
        domain: domainKey,
        owner: teacher,
      });
    }
  }
});

// Post-remove hook to adjust points when lectures are deleted
lectureSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const allocatedSubject = await AllocatedSubject.findById(doc.subject);

    if (!allocatedSubject) {
      console.error("Subject not found for lecture:", doc.subject);
      return;
    }

    const { min_lectures, subject_credit, teacher, type } = allocatedSubject;
    const domainKey = `${subject_credit}-${type}`;
    const domainPoints = await getPointsForDomain(domainKey);

    if (!domainPoints) {
      console.error("Domain points not found for:", domainKey);
      return;
    }

    const lectureCount = await Lecture.countDocuments({ subject: doc.subject });
    const points = await Point.findOne({ owner: teacher, domain: domainKey });

    if (lectureCount === min_lectures - 1) {
      // Remove domain points if lectures go below the minimum
      if (points) {
        const updatedPoints = points.points - domainPoints;
        await Point.findByIdAndUpdate(points._id, {
          points: Math.max(updatedPoints, 0), // Ensure points don't go below 0
        });
      }
    } else if (lectureCount >= min_lectures) {
      // Deduct extra lecture points (10% of domain points per lecture)
      const extraPoints = domainPoints * 0.1;
      if (points) {
        await Point.findByIdAndUpdate(points._id, { $inc: { points: -extraPoints } });
      }
    }
  }
});

export const Lecture = mongoose.model("Lecture", lectureSchema);
