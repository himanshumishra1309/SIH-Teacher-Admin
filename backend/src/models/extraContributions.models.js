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
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "Teacher"
    }
},
{ timestamps: true });

export const Contribution = mongoose.model('Contribution', contributonsSchema);