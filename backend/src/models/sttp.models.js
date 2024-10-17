import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models';
import { domainPoints } from '../utils/domainPoints';

const sttpSchema = new Schema(
{
    topic: {
        type: String,
        required:true,
        trim: true
    },
    duration: {
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
    venue:{
        type: String,
        required:true,
        trim: true
    },
    report: {
        type: String, //cloudinary url
        required: true,
    },
    addedOn: {
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher"
    }
},
{ timestamps: true });

// Post-save hook to add points
sttpSchema.post('save', async function(doc) {
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.startDate },
        { $inc: { points: domainPoints.STTP } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
sttpSchema.post('findOneAndDelete', async function(doc){
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: -domainPoints.STTP } },
        { new: true }
    )
})

export const STTP = mongoose.model('STTP', sttpSchema);