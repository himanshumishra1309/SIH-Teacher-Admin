import mongoose, { Schema } from 'mongoose';

const seminarTaskSchema = new Schema(
{
    topic: {
        type: String,
        required: true,
    },
    duration:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
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

export const SemianrTask = mongoose.model('SemianrTask', seminarTaskSchema);