import mongoose, { Schema } from 'mongoose';
import { Point } from './points.models.js';
import { DomainPoint } from './domainpoints.models.js';

const studentGuidedSchema = new Schema(
{
    topic: {
        type: String,
        required:true,
        trim: true
    },
    student_name: {
        type: String,
        required:true,
        trim: true
    },
    roll_no: {
        type: String,
        required:true,
        trim: true
    },
    branch: {
        type: String,
        required:true,
        trim: true
    },
    mOp: {
        type: String,
        required:true,
        enum:['Mtech', 'PhD']
    },
    academic_year:{
        type: String,
        required:true,
        trim: true
    },
    addedOn: {
        type: Date,
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
    const points = await getPointsForDomain(domain);
    const date = addedOn || Date.now(); // Use current date if `addedOn` is undefined

    const existingPoint = await Point.findOne({ owner: teacherId, domain });

    if (existingPoint) {
        await Point.findByIdAndUpdate(existingPoint._id, {
            $inc: { points },
        });
    } else {
        await Point.create({
            date,
            points,
            domain,
            owner: teacherId,
        });
    }
};


// Post-save hook to allocate points
studentGuidedSchema.post('save', async function (doc) {
    const domain = `${doc.mOp} Students Guided`; // Generate the domain key (e.g., "Mtech Students Guided")
    await allocatePoints(doc.owner, domain, doc.publicationDate);
});

// Post-remove hook to deduct points
studentGuidedSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const domain = `${doc.mOp} Students Guided`; // Generate the domain key (e.g., "Mtech Students Guided")
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

export const StudentGuided = mongoose.model('StudentGuided', studentGuidedSchema);