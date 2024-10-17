import mongoose, { Schema } from 'mongoose';

const graphSchema = new Schema(
{
    date: {
        type: Date,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    }
},
{ timestamps: true });

export const Graph = mongoose.model('Graph', graphSchema);