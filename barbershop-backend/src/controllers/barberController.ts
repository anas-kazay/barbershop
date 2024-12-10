import { Request, Response } from "express";
import * as barberService from "../services/barberService"; // Import the service

// Controller to get all barbers
export const getAllBarbersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const barbers = await barberService.getAllBarbers(); // Get all barbers from the service
    if (!barbers || barbers.length === 0) {
      res.status(404).json({ error: "No barbers found" });
      return;
    }
    res.status(200).json(barbers); // Return the list of barbers
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch barbers" });
  }
};
