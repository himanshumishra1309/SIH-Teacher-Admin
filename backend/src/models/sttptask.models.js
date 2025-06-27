import mongoose, { Schema } from 'mongoose';

const sttpTaskSchema = new Schema(
{
    topic: {
        type: String,
        required: true,
    },
    venue:{
        type: String,
        required: true,
    },
    start_date:{
        type: Date,
        required: true,
    },
    end_date:{
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

export const STTPTask = mongoose.model('STTPTask', sttpTaskSchema);