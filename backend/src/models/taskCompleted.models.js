import mongoose, { Schema } from 'mongoose';

const taskCompletedSchema = new Schema(
{
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'TaskAssigned',
        required: true,
    },
    completedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    taskType: {
        type: String,
        required: true,
        enum: ['Research', 'STTP', 'Events', "Seminars"]
    },
},
{ timestamps: true });

export const CompletedTask = mongoose.model('CompletedTask', taskCompletedSchema);