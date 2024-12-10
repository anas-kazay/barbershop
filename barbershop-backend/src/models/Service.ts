import mongoose, { Schema, Document } from "mongoose";

// Service interface for MongoDB with Mongoose
export interface Service extends Document {
  id: string;
  name: string;
  price: number;
  duration: number;
}

// Mongoose Schema for Service
const serviceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create and export the model
const ServiceModel = mongoose.model<Service>("Service", serviceSchema);

export default ServiceModel;
