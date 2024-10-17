import mongoose, { Schema } from 'mongoose';

const lectureFeedbackSchema = new Schema(
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
    rating:{
        type: Number,
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        index: true,
    },
    feedbackForm: {  // Optional field to link feedback to a specific feedback form
        type: Schema.Types.ObjectId,
        ref: 'FeedbackForm',
    },
},
{ timestamps: true });

export const LectureFeedback = mongoose.model('LectureFeedback', lectureFeedbackSchema);