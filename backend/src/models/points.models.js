import mongoose, { Schema } from 'mongoose';

const pointSchema = new Schema(
{
    date: {
        type: Date,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    domain: {
        type: String,
        required: true,
        enum:['Journal', 'Books', 'Chapters', 'Conferences', 'Patents', 'Thesis', 'Projects', 'Seminars Conducted', 'Seminars Attended', 'STTP Conducted', 'Events Participated', 'Lectures', 'Students Guided']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    }
},
{ timestamps: true });

export const Point = mongoose.model('Point', pointSchema);