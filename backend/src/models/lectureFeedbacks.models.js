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
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: String, // changed
        required: true,
    },
    question1_rating:{
        type: Number,
        required: true,
    },
    question2_rating:{
        type: Number,
        required: true,
    },
    question3_rating:{
        type: Number,
        required: true,
    },
    question4_rating:{
        type: Number,
        required: true,
    },
    question5_rating:{
        type: Number,
        required: true,
    },
    question6_rating:{
        type: Number,
        required: true,
    },
    question7_rating:{
        type: Number,
        required: true,
    },
    question8_rating:{
        type: Number,
        required: true,
    },
    question9_rating:{
        type: Number,
        required: true,
    },
    question10_rating:{
        type: Number,
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
    submitter: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        index: true,
    },
    submissionTime: {
        type: Date, 
        required: true,
    },
    // releaseTime: {
    //     type: Date, 
    //     required: true,
    // },
    // activeUntil: {
    //     type: Date, 
    //     required: true,
    // }
},
{ timestamps: true });

// Middleware to set `activeUntil` automatically
// lectureFeedbackSchema.pre('save', function (next) {
//     if (this.isNew) {
//         this.activeUntil = new Date(this.releaseTime.getTime() + 2 * 24 * 60 * 60 * 1000); // Add 2 days to releaseTime
//     }
//     next();
// });

export const LectureFeedback = mongoose.model('LectureFeedback', lectureFeedbackSchema);
