import mongoose, { Schema } from 'mongoose';

const completedTaskSchema = new Schema(
{
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    submittedAt:{
        type: Date,
        required: true,
    },
    deadline:{
        type: Date,
        required: true,
    },
    task:{
        type: Schema.Types.ObjectId,
        ref: 'Task',
    },
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
    },
},
{ timestamps: true });

export const Completedtask = mongoose.model('Completedtask', completedTaskSchema);