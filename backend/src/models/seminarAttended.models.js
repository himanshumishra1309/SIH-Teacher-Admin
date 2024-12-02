import mongoose, { Schema } from 'mongoose';
import { Point } from './points.models.js';
import { DomainPoint } from './domainpoints.models.js';

const seminarAttendedSchema = new Schema(
{
    topic: {
        type: String,
        required:true,
        trim: true
    },
    seminarType: {
        type: String,
        required:true,
        enum:['International', 'National', 'State']
    },
    images: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    report: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Teacher"
    }
},
{ timestamps: true });

const getPointsForDomain = async (domain) => {
    const domainPoint = await DomainPoint.findOne({ domain });
    return domainPoint?.points || 0; // Default to 0 if the domain is not found
};

// Function to allocate points in the `Point` model
const allocatePoints = async (teacherId, domain, addedOn) => {
    const points = await getPointsForDomain(domain); // Fetch points for the domain

    // Search for an existing domain for the teacher
    const existingPoint = await Point.findOne({ owner: teacherId, domain });

    if (existingPoint) {
        // Update points if the domain exists
        await Point.findByIdAndUpdate(existingPoint._id, {
            $inc: { points },
        });
    } else {
        // Create a new domain if it does not exist
        await Point.create({
            date: addedOn,
            points,
            domain,
            owner: teacherId,
        });
    }
};

// Post-save hook to allocate points
seminarAttendedSchema.post('save', async function (doc) {
    const domain = `${doc.seminarType} Seminar Attended`; // Generate the domain key (e.g., "International Seminar Attended")
    await allocatePoints(doc.owner, domain, doc.publicationDate);
});

// Post-remove hook to deduct points
seminarAttendedSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const domain = `${doc.seminarType} Seminar Attended`; // Generate the domain key (e.g., "International Seminar Attended")
        const points = await getPointsForDomain(domain); // Fetch points for the domain

        // Search for an existing domain for the teacher
        const existingPoint = await Point.findOne({ owner: doc.owner, domain });

        if (existingPoint) {
            // Deduct points
            await Point.findByIdAndUpdate(existingPoint._id, {
                $inc: { points: -points },
            });

            // Optionally, remove the document if points drop to 0
            if (existingPoint.points - points <= 0) {
                await Point.findByIdAndDelete(existingPoint._id);
            }
        }
    }
});

export const SeminarAttended = mongoose.model('SeminarAttended', seminarAttendedSchema);