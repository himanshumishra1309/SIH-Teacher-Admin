import mongoose, { Schema } from 'mongoose';

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
    min_lectures:{
        type: Number,
        required: true,
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        index: true,
    }
},
{ timestamps: true });

export const AllocatedSubject = mongoose.model('AllocatedSubject', allocatedSubjectSchema);