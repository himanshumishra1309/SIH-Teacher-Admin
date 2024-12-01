import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { DomainPoint } from './domainpoints.models.js';

const projectSchema = new Schema(
{
    topic: {
        type: String,
        required:true,
        trim: true
    },
    branch_name: {
        type: String,
        required:true,
        trim: true
    },
    daily_duration: {
        type: Number,
        required:true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    addedOn:{
        type: Date,
        required: true
    },
    projectType: {
        type: String,
        required: true,
        trim: true,
        enum: ['Major', 'Minor']
    },
    report: {
        type: String, //cloudinary url
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher"
    }
},
{ timestamps: true });

const getPointsForDomain = async (key) => {
    const domainPoint = await DomainPoint.findOne({ domain: key });
    return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
projectSchema.post('save', async function(doc) {
    const points = await getPointsForDomain(doc.projectType);
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.startDate },
        { $inc: { points: points } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
projectSchema.post('findOneAndDelete', async function(doc){
    const points = await getPointsForDomain(doc.projectType);
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: -points } },
        { new: true }
    )
})

export const Project = mongoose.model('Project', projectSchema);