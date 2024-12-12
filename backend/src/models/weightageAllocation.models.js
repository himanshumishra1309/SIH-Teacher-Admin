import mongoose, { Schema } from 'mongoose';

const weightageSchema = new Schema(
{
    designation: {
        type: String,
        required: true,
        enum: ['HOD', "Assistant Professor"]
    },
    research: {
        type: Number,
        required: true,
    },
    teaching: {
        type: Number,
        required: true,
    },
    other: {
        type: Number,
        required: true,
    },
},
{ timestamps: true });

export const Weightage = mongoose.model('Weightage', weightageSchema);