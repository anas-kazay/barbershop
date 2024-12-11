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
import moment from "moment-timezone";

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
    // Destructure and validate input
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

    // Validate required fields
    if (
      !userId ||
      !barberId ||
      !serviceIds?.length ||
      !time ||
      !totalPrice ||
      !totalDuration
    ) {
      return res.status(400).json({
        message: "Missing required appointment details",
      });
    }

    // Fetch user and barber with error handling
    const [user, barber, services] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(barberId),
      ServiceModel.find({ _id: { $in: serviceIds } }),
    ]);

    // Validate user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate barber
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    // Validate barber's working schedule
    if (!barber.workingSchedule || barber.workingSchedule.length !== 7) {
      return res.status(400).json({
        message: "Barber's working schedule is not completely defined",
      });
    }

    // Validate services
    if (services.length !== serviceIds.length) {
      return res
        .status(404)
        .json({ message: "One or more services not found" });
    }

    // Parse and validate appointment time
    const appointmentMoment = moment(time);
    const dayOfWeek = appointmentMoment.day();

    // Find schedule for the specific day
    const scheduleForDay = barber.workingSchedule.find(
      (schedule: WorkingSchedule) => schedule.dayOfWeek === dayOfWeek
    );

    // Check if barber works on this day
    if (!scheduleForDay || !scheduleForDay.isWorking) {
      return res.status(400).json({
        message: "Barber is not working on this day",
      });
    }

    // Validate time against barber's working hours
    const startMoment = moment(time).set({
      hour: parseInt(scheduleForDay.startTime.split(":")[0]),
      minute: parseInt(scheduleForDay.startTime.split(":")[1]),
    });

    const endMoment = moment(time).set({
      hour: parseInt(scheduleForDay.endTime.split(":")[0]),
      minute: parseInt(scheduleForDay.endTime.split(":")[1]),
    });

    // Check if appointment time is within working hours
    if (!appointmentMoment.isBetween(startMoment, endMoment, null, "[)")) {
      return res.status(400).json({
        message: "Barber is not available at this time",
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await AppointmentModel.findOne({
      barberId,
      time: {
        $gte: appointmentMoment.startOf("hour").toISOString(),
        $lt: appointmentMoment.endOf("hour").toISOString(),
      },
      status: { $ne: "cancelled" },
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked",
      });
    }

    // Prepare appointment data
    const appointment = new AppointmentModel({
      userId,
      barberId,
      serviceIds,
      serviceNames: services.map((service) => service.name),
      time,
      status,
      comment,
      totalPrice,
      totalDuration,
      customerName: user.name,
      barberName: barber.name,
    });

    // Save appointment
    await appointment.save();

    // Return created appointment
    res.status(201).json(appointment);
  } catch (error) {
    // Comprehensive error handling
    console.error("Error reserving appointment:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle potential database connection errors
    if (error instanceof mongoose.Error) {
      return res.status(500).json({
        message: "Database error",
        error: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      message: "Unexpected error occurred while reserving appointment",
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
