import mongoose, { Schema } from 'mongoose';

const researchTaskByHODSchema = new Schema(
{
    task_Part:{
        type: Schema.Types.ObjectId,
        ref: 'ResearchTaskByAdmin',
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
    },
    work:{
        type: Number,
        required: true,
    }
},
{ timestamps: true });

export const ResearchTaskByHOD = mongoose.model('ResearchTaskByHOD', researchTaskByHODSchema);