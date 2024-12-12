import mongoose, { Schema } from 'mongoose';

const taskAssignedByAdminSchema = new Schema(
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
    taskType: {
        type: String,
        required: true,
        enum: ['Research', 'STTP', 'Events', "Seminars"]
    },
    assignedAt:{
        type: Date,
        required: true,
    },
    totalWork:{
        type: Number,
        required: true,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    }
},
{ timestamps: true });

export const TaskAssigned = mongoose.model('TaskAssigned', taskAssignedByAdminSchema);