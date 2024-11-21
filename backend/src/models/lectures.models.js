import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { domainPoints } from '../utils/domainPoints.js';

const lectureSchema = new Schema(
{
    subject:{
        type: Schema.Types.ObjectId,
        ref:"AllocatedSubject",
    },
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
    date: {
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
lectureSchema.post('save', async function(doc) {
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: domainPoints.Lecture } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
lectureSchema.post('findOneAndDelete', async function(doc){
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: -domainPoints.Lecture } },
        { new: true }
    )
})

export const Lecture = mongoose.model('Lecture', lectureSchema);