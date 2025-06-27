import mongoose, { Schema } from 'mongoose';

const researchWorkTaskSchema = new Schema(
{
    name:{
        type: String,
        required: true,
    },
    alloted:{
        type: Number,
        required: true,
    },
    h5_index:{
        type: Number,
        required: true,
    },
    report:{
        type: String,
        required: true,
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    completed:{
        type: Boolean,
        required: false,
    }
},
{ timestamps: true });

export const ResearchTask = mongoose.model('ResearchTask', researchWorkTaskSchema);