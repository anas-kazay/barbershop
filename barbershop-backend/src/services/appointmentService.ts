import AppointmentModel, { Appointment } from "../models/Appointement";

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    // Fetch all appointments
    return await AppointmentModel.find();
  } catch (error) {
    throw new Error("Error fetching appointments");
  }
};

export const getAppointmentsByUserId = async (
  userId: string
): Promise<Appointment[]> => {
  try {
    return await AppointmentModel.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    throw new Error("Error fetching appointments by user ID");
  }
};

export const getAppointmentsByBarberId = async (
  barberId: string
): Promise<Appointment[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00:00
    console.log(today.toISOString());

    return await AppointmentModel.find({
      barberId,
      status: { $ne: "cancelled" },
      time: {
        $gte: today.toISOString(),
      },
    }).sort({ time: 1 });
  } catch (error) {
    throw new Error("Error fetching appointments by barber ID");
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<Appointment> => {
  try {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: newStatus },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    return updatedAppointment;
  } catch (error) {
    throw new Error("Error updating appointment status");
  }
};

export const getAppointmentsByBarberAndDay = async (
  barberId: string,
  day: Date
): Promise<Appointment[]> => {
  try {
    // Create start and end of the day
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    // Find appointments for the specific barber on the given day, excluding cancelled appointments
    return await AppointmentModel.find({
      barberId: barberId,
      status: { $ne: "cancelled" },
      time: {
        $gte: startOfDay.toISOString(),
        $lt: endOfDay.toISOString(),
      },
    });
  } catch (error) {
    throw new Error(
      `Error fetching appointments for barber on specified day: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
