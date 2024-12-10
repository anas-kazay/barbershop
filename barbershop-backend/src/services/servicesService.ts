import ServiceModel, { Service } from "../models/Service";

export const getAllServices = async (): Promise<Service[]> => {
  try {
    // Fetch all services from the database
    console.log("Fetching all services...");
    const services = await ServiceModel.find(); // Mongoose method to retrieve all documents
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Could not fetch services");
  }
};
