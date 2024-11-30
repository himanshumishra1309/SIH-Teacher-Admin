import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema(
{
    subject_name:{
        type: String,
        required: true,
        index: true,
    },
    subject_code:{
        type: String,
        required: true,
        index: true,
    },
    subject_credit:{
        type: Number,
        required: true,
    },
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    branch:{
        type: String,
        required: true,
        enum: ['CSE', 'IT', 'EXTC', 'EE', 'ME', 'CE'],
    },
    year:{
        type: String,
        enum: ['First', 'Second', 'Third', 'Fourth'],
        required: true,
    },
    date:{
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Date cannot be in the future.',
        },
    },
    lecture:{
        type: Schema.Types.ObjectId,
        ref: 'Lecture',
    },
    studentsPresent:[{
        type: Schema.Types.ObjectId,
        ref: 'Student',
    }],
},
{ timestamps: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);