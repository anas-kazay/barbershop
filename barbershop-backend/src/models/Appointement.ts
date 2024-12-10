import mongoose, { Document, Schema } from "mongoose";

// Appointment interface
export interface Appointment extends Document {
  id: string;
  userId: mongoose.Schema.Types.ObjectId;
  barberId: mongoose.Schema.Types.ObjectId;
  customerName: string;
  barberName: string;
  serviceIds: mongoose.Schema.Types.ObjectId[];
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  comment: string;
  totalPrice: number;
  totalDuration: number;
  serviceNames: [string];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Appointment
const appointmentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String, required: true },
    barberName: { type: String, required: true },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      required: true,
      default: "pending",
    },
    comment: { type: String, default: "" },
    totalPrice: { type: Number, required: true },
    serviceNames: [String],
    totalDuration: { type: Number, required: true },
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model<Appointment>(
  "Appointment",
  appointmentSchema
);

export default AppointmentModel;
