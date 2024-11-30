import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainPoint.model.js';

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
        conferenceType: {
            type: String,
            enum: ['International', 'National', 'Other'], // Conference classification
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

// Helper function to dynamically fetch points
const getPointsForConferenceType = async (conferenceType) => {
    const domainPoint = await DomainPoint.findOne({ domain: conferenceType });
    return domainPoint?.points || 0; // Default points to 0 if not found
};

// Post-save hook for adding points to the graph
conferenceSchema.post('save', async function (doc) {
    const points = await getPointsForConferenceType(doc.conferenceType);

    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.publicationDate },
        { $inc: { points: points } },
        { upsert: true }
    );
});

// Post-remove hook for deducting points
conferenceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const points = await getPointsForConferenceType(doc.conferenceType);

        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.publicationDate },
            { $inc: { points: -points } },
            { new: true }
        );
    }
});

export const Conference = mongoose.model('Conference', conferenceSchema);
