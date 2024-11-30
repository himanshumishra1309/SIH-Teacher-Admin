import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainpoints.models.js';
import { Point } from './points.models.js';

const allocatedSubjectSchema = new Schema(
  {
    subject_name: {
      type: String,
      trim: true,
      required: true,
    },
    subject_code: {
      type: String,
      required: true,
    },
    subject_credit: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'IT', 'EXTC', 'EE', 'ME', 'CE'],
    },
    year: {
      type: String,
      required: true,
      enum: ['First', 'Second', 'Third', 'Fourth'],
    },
    type: {
      type: String,
      enum: ['Theory', 'Practical'], // Theory or Practical
      required: true,
    },
    min_lectures: {
      type: Number,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      index: true,
      required: true,
    },
    feedbackReleased: {
      type: Boolean,
      default: false, // Initially false
    },
    activeUntil: {
      type: Date, // Time until feedback remains active
    },
  },
  { timestamps: true }
);

// Helper function to generate the domain key (e.g., "4-Theory" or "3-Practical")
const getDomainKey = (subject_credit, type) => {
  return `${subject_credit}-${type}`;
};

// Helper function to fetch points based on the generated key
const getPointsForDomain = async (key) => {
  const domainPoint = await DomainPoint.findOne({ domain: key });
  return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook for adding points to the graph
allocatedSubjectSchema.post('save', async function (doc) {
  const domainKey = getDomainKey(doc.subject_credit, doc.type); // Generate the key
  const points = await getPointsForDomain(domainKey); // Fetch points for the key

  await Point.create({
    date: doc.createdAt,
    points: points,
    domain: domainKey,
    owner: doc.teacher,
  });

  await Graph.findOneAndUpdate(
    { owner: doc.teacher, date: doc.createdAt },
    { $inc: { points: points } },
    { upsert: true }
  );
});

// Post-remove hook for deducting points
allocatedSubjectSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const domainKey = getDomainKey(doc.subject_credit, doc.type); // Generate the key
    const points = await getPointsForDomain(domainKey); // Fetch points for the key

    await Graph.findOneAndUpdate(
      { owner: doc.teacher, date: doc.createdAt },
      { $inc: { points: -points } }, // Deduct points
      { new: true }
    );
  }
});

export const AllocatedSubject = mongoose.model('AllocatedSubject', allocatedSubjectSchema);