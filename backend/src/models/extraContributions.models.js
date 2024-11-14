import mongoose, { Schema } from 'mongoose';

const contributonsSchema = new Schema(
{
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    images: [
        {
            type: String,
        }
    ],
    report: {
        type: String,
    }
},
{ timestamps: true });

export const Contribution = mongoose.model('Contribution', contributonsSchema);