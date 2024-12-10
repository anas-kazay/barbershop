import mongoose, { Document, Schema } from "mongoose";

export interface Barbershop extends Document {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  ownerId: mongoose.Schema.Types.ObjectId;
  services: mongoose.Schema.Types.ObjectId[];
}

// Mongoose Schema for Barbershop
const barbershopSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

// Create and export the model
const BarbershopModel = mongoose.model<Barbershop>(
  "Barbershop",
  barbershopSchema
);

export default BarbershopModel;
