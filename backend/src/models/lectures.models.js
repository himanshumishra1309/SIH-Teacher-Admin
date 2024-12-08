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

// Post-save hook to allocate extra lecture points
lectureSchema.post("save", async function (doc) {
  const allocatedSubject = await AllocatedSubject.findById(doc.subject);

  if (!allocatedSubject) {
    console.error("Subject not found for lecture:", doc.subject);
    return;
  }

  const { min_lectures, subject_credit, teacher, type } = allocatedSubject;
  const lectureCount = await Lecture.countDocuments({ subject: doc.subject });

  if (lectureCount > min_lectures) {
    const domainKey = `${subject_credit}-${type}`;
    const domainPoints = await getPointsForDomain(domainKey);

    if (!domainPoints) {
      console.error("Domain points not found for:", domainKey);
      return;
    }

    const extraPoints = domainPoints * 0.1; // 10% points per extra lecture
    const points = await Point.findOne({ owner: teacher, domain: domainKey });

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

// Post-remove hook to deduct points when lectures are deleted
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

    if (lectureCount >= min_lectures) {
      const extraPoints = domainPoints * 0.1; // 10% points per extra lecture
      const points = await Point.findOne({ owner: teacher, domain: domainKey });

      if (points) {
        await Point.findByIdAndUpdate(points._id, { $inc: { points: -extraPoints } });
      }
    }

    if (lectureCount < min_lectures) {
      const points = await Point.findOne({ owner: teacher, domain: domainKey });

      if (points) {
        await Point.findByIdAndUpdate(points._id, { $inc: { points: -domainPoints } });

        if (points.points - domainPoints <= 0) {
          await Point.findByIdAndDelete(points._id); // Remove entry if points drop to 0
        }
      }
    }
  }
});

export const Lecture = mongoose.model("Lecture", lectureSchema);
