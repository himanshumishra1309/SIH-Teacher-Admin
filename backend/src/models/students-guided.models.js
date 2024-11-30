import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { domainPoints } from '../utils/domainPoints.js';

const studentGuidedSchema = new Schema(
{
    topic: {
        type: String,
        required:true,
        trim: true
    },
    student_name: {
        type: String,
        required:true,
        trim: true
    },
    roll_no: {
        type: String,
        required:true,
        trim: true
    },
    branch: {
        type: String,
        required:true,
        trim: true
    },
    mOp: {
        type: String,
        required:true,
        enum:['Mtech', 'PhD']
    },
    academic_year:{
        type: String,
        required:true,
        trim: true
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

const getPointsForDomain = async (key) => {
    const domainPoint = await DomainPoint.findOne({ domain: key });
    return domainPoint?.points || 0; // Default to 0 if no points are defined
};

// Post-save hook to add points
studentGuidedSchema.post('save', async function(doc) {
    const points = await getPointsForDomain(doc.mOp);
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.addedOn },
        { $inc: { points: points } },
        { upsert: true }
    );
});

// Post-remove hook to deduct points
studentGuidedSchema.post('findOneAndDelete', async function(doc){
    const points = await getPointsForDomain(doc.mOp);
    await Graph.findOneAndUpdate(
        { owner: doc.owner, date: doc.date },
        { $inc: { points: -points } },
        { new: true }
    )
})

export const StudentGuided = mongoose.model('StudentGuided', studentGuidedSchema);