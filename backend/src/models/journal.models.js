import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainpoints.models.js';

const journalSchema = new Schema(
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
        journal: {
            type: String,
            required: true,
        },
        volume: {
            type: Number, 
            required: true,
        },
        issue: {
            type: Number, 
            required: true,
        },
        pages: {
            type: String, 
            required: true,
        },
        publisher: {
            type: String,
            required: true,
        },
        journalType: {
            type: String,
            enum: ['International', 'National', 'Other'], 
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        }
    },
    { timestamps: true }
);

const getPointsForJournalType = async (journalType) => {
    const domainPoint = await DomainPoint.findOne({ domain: journalType });
    return domainPoint?.points || 0;
};

journalSchema.post('save', async function (doc) {
    const points = await getPointsForJournalType(doc.journalType);

    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.publicationDate },
        { $inc: { points: points } },
        { upsert: true }
    );
});

journalSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const points = await getPointsForJournalType(doc.journalType);

        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.publicationDate },
            { $inc: { points: -points } },
            { new: true }
        );
    }
});

export const Journal = mongoose.model('Journal', journalSchema);