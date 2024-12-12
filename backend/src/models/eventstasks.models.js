import mongoose, { Schema } from 'mongoose';

const eventTaskSchema = new Schema(
{
    event_name: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    },
    type:{
        type: String,
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

export const EventTask = mongoose.model('EventTask', eventTaskSchema);