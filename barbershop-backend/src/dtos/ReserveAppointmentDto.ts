import mongoose from "mongoose";

// DTO for reserving an appointment
export interface ReserveAppointmentDTO {
  userId: string; // Customer's ID
  barberId: string; // Barber's ID
  serviceIds: mongoose.Schema.Types.ObjectId[]; // List of service IDs
  time: string; // Appointment time (ISO format)
  comment: string; // Customer's comment or custom instructions for the service
  discount: number; // Discount applied to the total price
  totalPrice: number; // Total price after discount
  totalDuration: number; // Total duration of the appointment (in minutes)
}
