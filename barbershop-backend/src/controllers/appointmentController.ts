import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../models/User";
import { WorkingSchedule } from "../models/WorkingSchedule";
import AppointmentModel from "./../models/Appointement";
import {
  getAllAppointments,
  getAppointmentsByBarberAndDay,
  getAppointmentsByBarberId,
  getAppointmentsByUserId,
  updateAppointmentStatus,
} from "../services/appointmentService";
import { UserRole } from "../models/UserRole";
import jwt from "jsonwebtoken";
import ServiceModel from "../models/Service";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

interface ReserveAppointmentDTO {
  userId: string;
  barberId: string;
  serviceIds: string[];
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  comment?: string;
  totalPrice: number;
  totalDuration: number;
  discount?: number;
}

// controller for fetching all appointments
export const getAllAppointmentsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await getAllAppointments();

    if (!appointments || appointments.length === 0) {
      res.status(404).json({ error: "No appointments found" });
      return;
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export const reserveAppointment = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      barberId,
      serviceIds,
      time,
      comment = "",
      totalPrice,
      totalDuration,
      status = "pending",
    } = req.body as ReserveAppointmentDTO;

    const user = await UserModel.findById(userId);
    const barber = await UserModel.findById(barberId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const customerName = user.name;

    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }
    const barberName = barber.name;

    // Check if the barber has a complete working schedule
    if (!barber.workingSchedule || barber.workingSchedule.length !== 7) {
      return res.status(400).json({
        message: "Barber's working schedule is not completely defined",
      });
    }

    const requestedTime = new Date(time);
    const adjustedTime = new Date(requestedTime);
    adjustedTime.setHours(requestedTime.getHours() + 1);
    const dayOfWeek = requestedTime.getDay();
    const requestedTimeString = adjustedTime.toTimeString().slice(0, 5); // HH:MM format

    // Find the schedule for the specific day
    const scheduleForDay = barber.workingSchedule.find(
      (schedule: WorkingSchedule) => schedule.dayOfWeek === dayOfWeek
    );

    // Check if the barber is working on this day
    if (!scheduleForDay || !scheduleForDay.isWorking) {
      return res
        .status(400)
        .json({ message: "Barber is not working on this day" });
    }

    const { startTime, endTime } = scheduleForDay;

    // Check if the requested time is within the working hours
    if (requestedTimeString < startTime || requestedTimeString >= endTime) {
      return res
        .status(400)
        .json({ message: "Barber is not available at this time" });
    }

    // Fetch service names
    const services = await ServiceModel.find({ _id: { $in: serviceIds } });
    const serviceNames = services.map((service) => service.name);

    const appointment = new AppointmentModel({
      userId,
      barberId,
      serviceIds,
      serviceNames,
      time,
      status,
      comment,
      totalPrice,
      totalDuration,
      customerName,
      barberName,
    });

    // Save the appointment to the database
    await appointment.save();

    // Return the created appointment
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error reserving appointment:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors,
      });
    }

    res.status(500).json({
      message: "Error reserving appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Controller for fetching appointments by user ID
export const getAppointmentsByUserIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "No Authorization header provided",
      details: "Authorization header is missing",
    });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      message: "Invalid Authorization header format",
      details: "Format should be 'Bearer <token>'",
    });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: UserRole;
    };

    const userId = decoded.userId;

    const appointments = await getAppointmentsByUserId(userId);

    if (!appointments || appointments.length === 0) {
      res.status(404).json({ error: "No appointments found for the user" });
    } else {
      res.status(200).json(appointments);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch appointments by user ID" });
  }
};

// Controller for fetching appointments by barber ID
export const getAppointmentsByBarberIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      message: "No Authorization header provided",
      details: "Authorization header is missing",
    });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      message: "Invalid Authorization header format",
      details: "Format should be 'Bearer <token>'",
    });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: UserRole;
    };

    if (decoded.role !== "barber") {
      res.status(403).json({
        error: "Unauthorized access",
        details: "Only barbers can access their appointments",
      });
      return;
    }

    const barberId = decoded.userId;

    const appointments = await getAppointmentsByBarberId(barberId);

    if (!appointments || appointments.length === 0) {
      res.status(404).json({ error: "No appointments found for the barber" });
    } else {
      res.status(200).json(appointments);
    }
  } catch (error) {
    console.error(error);

    // More detailed error handling
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: "Token expired",
        details: "Please log in again",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Invalid token",
        details: "The provided token is invalid",
      });
    } else {
      res
        .status(500)
        .json({ error: "Failed to fetch appointments by barber ID" });
    }
  }
};

// Controller for updating appointment status
export const updateAppointmentStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { appointmentId } = req.params;
  const { newStatus } = req.body;

  try {
    const updatedAppointment = await updateAppointmentStatus(
      appointmentId,
      newStatus
    );

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};

export const getAppointmentsByBarberAndDayController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { barberId } = req.params;
    const dayParam = req.query.day as string;

    // Validate barberId
    if (!barberId) {
      res.status(400).json({ error: "Barber ID is required" });
      return;
    }

    // Validate day parameter
    if (!dayParam) {
      res.status(400).json({ error: "Day is required" });
      return;
    }

    const day = new Date(dayParam);

    console.log(day, barberId);

    // Call the service function
    const appointments = await getAppointmentsByBarberAndDay(barberId, day);

    // Check if any appointments were found
    if (!appointments || appointments.length === 0) {
      res.status(404).json({
        message: "No appointments found for this barber on the specified day",
      });
      return;
    }

    // Send successful response
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getAppointmentsByBarberAndDayController:", error);

    // Handle different types of errors
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ error: "Invalid barber ID format" });
    } else {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  }
};
