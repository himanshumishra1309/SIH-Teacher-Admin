import mongoose, { Schema } from 'mongoose';

const taskAssignedByHODSchema = new Schema(
{
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
        ref: 'Teacher',
        required: true,
    }
},
{ timestamps: true });

export const HODAssigned = mongoose.model('HODAssigned', taskAssignedByHODSchema);