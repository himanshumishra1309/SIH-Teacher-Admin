import mongoose, { Schema } from 'mongoose';
import { AllocatedSubject } from './allocated-subjects.models.js';
import { Point } from './points.models.js';

const lectureSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'AllocatedSubject',
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
      ref: 'Teacher',
      required: true,
    },
  },
  { timestamps: true }
);

// Post-save hook to manage points
lectureSchema.post('save', async function (doc) {
  const allocatedSubject = await AllocatedSubject.findById(doc.subject);

  if (!allocatedSubject) {
    console.error('Subject not found for lecture:', doc.subject);
    return;
  }

  const { min_lectures, subject_credit, teacher } = allocatedSubject;

  // Count completed lectures for the subject
  const lectureCount = await Lecture.countDocuments({ subject: doc.subject });

  if (lectureCount > min_lectures) {
    const domainKey = `${subject_credit}-${allocatedSubject.type}`;
    const extraLectures = lectureCount - min_lectures;

    // Extra points for lectures beyond the minimum
    const extraPoints = extraLectures > 0 ? subject_credit * 0.1 : 0;

    const points = await Point.findOne({ owner: teacher, domain: domainKey });
    if (points) {
      // Update existing points
      await Point.findByIdAndUpdate(points._id, { $inc: { points: extraPoints } });
    } else {
      // Create new points entry
      await Point.create({
        date: doc.createdAt,
        points: extraPoints,
        domain: domainKey,
        owner: teacher,
      });
    }
  }
});

// Post-remove hook to deduct points
lectureSchema.post('findOneAndDelete', async function (doc) {
  const allocatedSubject = await AllocatedSubject.findById(doc.subject);

  if (!allocatedSubject) {
    console.error('Subject not found for lecture:', doc.subject);
    return;
  }

  const { min_lectures, subject_credit, teacher } = allocatedSubject;
  const domainKey = `${subject_credit}-${allocatedSubject.type}`;

  // Count completed lectures for the subject
  const lectureCount = await Lecture.countDocuments({ subject: doc.subject });

  if (lectureCount > min_lectures) {
    const extraPoints = subject_credit * 0.1;

    const points = await Point.findOne({ owner: teacher, domain: domainKey });
    if (points) {
      // Deduct points and delete entry if necessary
      const newPoints = points.points - extraPoints;
      if (newPoints <= 0) {
        await Point.findByIdAndDelete(points._id);
      } else {
        await Point.findByIdAndUpdate(points._id, { points: newPoints });
      }
    }
  }
});

export const Lecture = mongoose.model('Lecture', lectureSchema);