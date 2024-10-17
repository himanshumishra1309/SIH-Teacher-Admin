import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models';
import { domainPoints } from '../utils/domainPoints';

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

// Post-save hook to add points
projectSchema.post('save', async function(doc) {
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.startDate },
        { $inc: { points: domainPoints.Project } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
projectSchema.post('findOneAndDelete', async function(doc){
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: -domainPoints.Lecture } },
        { new: true }
    )
})

export const Project = mongoose.model('Project', projectSchema);