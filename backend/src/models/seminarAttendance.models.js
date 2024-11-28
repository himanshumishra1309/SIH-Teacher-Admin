import mongoose, { Schema } from 'mongoose';

const seminarAttendanceSchema = new Schema(
{
    seminar: {
        type: Schema.Types.ObjectId,
        ref: "Seminar",
        required: true
    },
    date:{
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Date cannot be in the future.',
        },
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    studentsPresent:[{
        type: Schema.Types.ObjectId,
        ref: 'Student',
    }],
},
{ timestamps: true });

export const SAttendance = mongoose.model('SAttendance', seminarAttendanceSchema);