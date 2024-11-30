import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainpoints.models.js';

const expertLectureSchema = new Schema(
    {
        topic: {
          type: String,
          required: true,
          trim: true,
        },
        duration: {
          type: Number, // in hours
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        level: {
          type: String,
          enum: ["International", "National", "State"], // Lecture level
          required: true,
        },
        venue: {
          type: String, // Place where the lecture was conducted
          required: true,
          trim: true,
        },
        report: {
          type: String, // Cloudinary URL for the report document
          required: true,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: "Teacher",
          required: true,
        },
    },
{ timestamps: true });

const getPointsForDomain = async (key) => {
    const domainPoint = await DomainPoint.findOne({ domain: key });
    return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
expertLectureSchema.post('save', async function(doc) {// Generate the key
    const points = await getPointsForDomain(doc.level);
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: points} },
        { upsert: true }
    );
});


// Post-remove hook to deduct points
expertLectureSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const points = await getPointsForDomain(doc.level);
        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.date },
            { $inc: { points: -points } },
            { new: true }
        );
    }
});

export const ExpertLecture = mongoose.model('ExpertLecture', expertLectureSchema);