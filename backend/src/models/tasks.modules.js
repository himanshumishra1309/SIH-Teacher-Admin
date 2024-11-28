import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedAt:{
      type: Date,
      required: true,
    },
    deadline:{
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed'],
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'assignedByModel', // Dynamic reference
    },
    assignedByModel: {
      type: String,
      required: true,
      enum: ['Admin', 'Teacher'], // Models that can be referenced
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    points: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
