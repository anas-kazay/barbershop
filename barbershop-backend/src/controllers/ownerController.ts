import { Request, Response } from "express";
import * as ownerService from "../services/ownerService"; // Assuming userService has a method to fetch all users
import { WorkingSchedule } from "../models/WorkingSchedule";

export const getAllUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await ownerService.getAllUsers(); // Assuming this method fetches all users from the database
    if (!users || users.length === 0) {
      res.status(404).json({ error: "No users found" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createBarberController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract barber data from request body
    const barberData = req.body; // Ensure this contains necessary fields like email, password, etc.

    // Call the service to create the barber
    const newBarber = await ownerService.createBarber(barberData); // Assuming createBarber is implemented in the service layer

    res.status(201).json(newBarber); // Send back the newly created barber
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create barber" });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { barberId } = req.params; // Barber ID should be passed in the URL params

  try {
    const barber = await ownerService.deleteUser(barberId); // Call the service to delete the barber

    if (!barber) {
      res.status(404).json({ error: "Barber not found" });
      return;
    }

    res.status(200).json({ message: "Barber successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete barber" });
  }
};

export const updateBarberScheduleController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { barberId } = req.params; // Barber ID from URL params
  const newSchedule: WorkingSchedule[] = req.body.workingSchedule; // New schedule passed in the request body
  console.log(req.body.workingSchedule);
  if (!Array.isArray(newSchedule) || newSchedule.length === 0) {
    res.status(400).json({ error: "Invalid schedule format" });
    return;
  }

  try {
    // Call the service to update the schedule
    const updatedBarber = await ownerService.updateBarberSchedule({
      barberId,
      newSchedule,
    });

    if (!updatedBarber) {
      res.status(404).json({ error: "Barber not found" });
      return;
    }

    // Send a successful response with the updated barber info
    res.status(200).json({
      message: "Barber schedule updated successfully",
      updatedSchedule: updatedBarber.workingSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update barber's schedule" });
  }
};

export const createServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract service data from request body
    const serviceData = req.body; // Ensure this contains necessary fields like name, price, duration, etc.

    // Call the service to create the service
    const newService = await ownerService.createService(serviceData);

    // Return the newly created service
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create service" });
  }
};

export const deleteServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract the service ID from request parameters
    const { id } = req.params;
    console.log("service controller");
    console.log(id);

    // Call the service to delete the service
    await ownerService.deleteService(id);

    // Send a success response
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete service" });
  }
};

export const modifyServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract service ID from request parameters
    const { id } = req.params;

    // Extract updated service data from request body
    const updatedData = req.body;

    // Call the service to modify the service
    const updatedService = await ownerService.modifyService(id, updatedData);

    // Return the updated service
    res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to modify service" });
  }
};
