import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainPoint.model.js';

const chapterSchema = new Schema(
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
        book: {
            type: String, // Name of the book (if applicable)
            required: false,
        },
        volume: {
            type: Number, // Volume of the book or journal
            required: false,
        },
        pages: {
            type: String, // Page range, e.g., "123-134"
            required: false,
        },
        publisher: {
            type: String, // Publisher of the Chapter proceedings or book
            required: false,
        },
        chapterType: {
            type: String,
            enum: ['International', 'National', 'State'], // Chapter segregation
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

// Helper function to fetch points based on type
const getPointsForChapterType = async (chapterType) => {
    const domainPoint = await DomainPoint.findOne({ domain: chapterType });
    return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook for adding points to the graph
chapterSchema.post('save', async function (doc) {
    const points = await getPointsForChapterType(doc.chapterType);

    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.publicationDate },
        { $inc: { points: points } },
        { upsert: true }
    );
});

// Post-remove hook for deducting points
chapterSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const points = await getPointsForChapterType(doc.chapterType);

        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.publicationDate },
            { $inc: { points: -points } },
            { new: true }
        );
    }
});

export const Chapter = mongoose.model('Chapter', chapterSchema);
