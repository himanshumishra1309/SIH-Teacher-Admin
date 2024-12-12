import mongoose, { Schema } from "mongoose";

const publicationpointsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    hindex: {
      type: Number,
      required: true,
    },
    median: {
      type: Number,
      required: true,
    },
},
{ timestamps: true });

export const PublicationPoint = mongoose.model('PublicationPoint', publicationpointsSchema);