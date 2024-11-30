import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainPoint.model.js';

const bookSchema = new Schema(
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
    segregation: {
        type: String,
        enum: ['International', 'National', 'State'], // Segregation into levels
        required: true, // Ensures the type of book is defined
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true, // Mandatory field to link to the owner
    },
},
{ timestamps: true });

// Helper function to fetch points based on type
const getPointsForBookType = async (bookType) => {
    const domainPoint = await DomainPoint.findOne({ domain: bookType });
    return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook for adding points to the graph
bookSchema.post('save', async function (doc) {
    const points = await getPointsForBookType(doc.bookType);

    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.publicationDate },
        { $inc: { points: points } },
        { upsert: true }
    );
});

// Post-remove hook for deducting points
bookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const points = await getPointsForBookType(doc.bookType);

        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.publicationDate },
            { $inc: { points: -points } },
            { new: true }
        );
    }
});

export const Book = mongoose.model('Book', bookSchema);