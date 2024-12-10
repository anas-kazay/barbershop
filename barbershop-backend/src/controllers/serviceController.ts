import { Request, Response } from "express";
import { getAllServices } from "../services/servicesService";

export const getAllServicesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await getAllServices(); // Assuming this method fetches all services from the database
    if (!services || services.length === 0) {
      res.status(404).json({ error: "No services found" });
      return;
    }
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};
