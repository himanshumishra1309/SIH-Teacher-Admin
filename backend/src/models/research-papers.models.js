import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { domainPoints } from '../utils/domainPoints.js';

const researchPaperSchema = new Schema(
{
    name: {
        type: String,
        required:true,
        trim: true
    },
    addedOn: {
        type: Date,
        required: true
    },
    publication: {
        type: String,
        required:true,
        trim: true
    },
    publishedDate: {
        type: Date,
        required: true
    },
    impactFactor: {
        type: Number,
        required: true
    },
    unit:{
        type: Number,
        required: true,
        trim: true
    },
    viewUrl: {
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        index: true
    }
},
{ timestamps: true });

// Post-save hook to add points
researchPaperSchema.post('save', async function(doc) {
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.publishedDate },
        { $inc: { points: domainPoints.ResearchPaper } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
researchPaperSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.publishedDate },
            { $inc: { points: -domainPoints.ResearchPaper } },
            { new: true }
        );
    }
});

export const ResearchPaper = mongoose.model('ResearchPaper', researchPaperSchema);