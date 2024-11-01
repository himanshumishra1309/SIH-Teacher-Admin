import mongoose, { Schema } from 'mongoose';
import { Graph } from './graphs.models.js';
import { domainPoints } from '../utils/domainPoints.js';

const allocatedSubjectSchema = new Schema(
{
    subject_name: {
        type: String,
        trim: true,
        required: true,
    },
    subject_code:{
        type: String,
        required: true,
    },
    subject_credit: {
        type: Number,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    feedbackForm: {
        type: Schema.Types.ObjectId,
        ref: 'FeedbackForm',
        default: null,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        index: true,
    }
},
{ timestamps: true });

// // Post-save hook to add points
// allocatedSubjectSchema.post('save', async function(doc) {
//     await Graph.findOneAndUpdate(
//         { owner: doc.owner, date: doc.createdAt },
//         { $inc: { points: domainPoints.AllocatedSubject } },
//         { upsert: true }
//     );
// });

// // Post-remove hook to deduct points
// allocatedSubjectSchema.post('findOneAndDelete', async function(doc) {
//     if (doc) {
//         await Graph.findOneAndUpdate(
//             { owner: doc.owner, date: doc.createdAt },
//             { $inc: { points: -domainPoints.AllocatedSubject } },
//             { new: true }
//         );
//     }
// });

export const AllocatedSubject = mongoose.model('AllocatedSubject', allocatedSubjectSchema);