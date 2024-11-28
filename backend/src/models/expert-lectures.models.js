import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { domainPoints } from '../utils/domainPoints.js';

const expertLectureSchema = new Schema(
{
    topic: {
        type: String,
        required:true,
        trim: true
    },
    duration: {
        type: Number, // chnges 
        required:true,
        trim: true
    },
    date: {
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
expertLectureSchema.post('save', async function(doc) {
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: domainPoints.ExpertLecture } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
expertLectureSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Graph.findOneAndUpdate(
            { owner: doc.owner, date: doc.date },
            { $inc: { points: -domainPoints.ExpertLecture } },
            { new: true }
        );
    }
});

export const ExpertLecture = mongoose.model('ExpertLecture', expertLectureSchema);