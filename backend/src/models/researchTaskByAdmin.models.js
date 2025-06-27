import mongoose, { Schema } from 'mongoose';

const researchTaskByAdminSchema = new Schema(
{
    allocatedTo: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
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
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    citation_Target:{
        type: Number,
        required: true,
    }
},
{ timestamps: true });

export const ResearchTaskByAdmin = mongoose.model('ResearchTaskByAdmin', researchTaskByAdminSchema);