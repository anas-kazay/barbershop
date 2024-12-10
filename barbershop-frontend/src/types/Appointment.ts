export interface Appointment {
  _id: string;
  userId: string;
  customerName: string;
  barberName: string;
  barberId: string;
  serviceIds: string[];
  serviceNames: string[];
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  comment: string;
  totalPrice: number;
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}
