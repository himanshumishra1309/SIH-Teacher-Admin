import mongoose, { Schema } from 'mongoose';

const studySubjectSchema = new Schema(
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
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    }
},
{ timestamps: true });

export const StudySubject = mongoose.model('StudySubject', studySubjectSchema);