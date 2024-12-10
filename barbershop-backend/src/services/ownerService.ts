import { CreateUserDto } from "../dtos/createUserDto";
import { UpdateScheduleDTO } from "../dtos/updateScheduleDTO";
import ServiceModel, { Service } from "../models/Service";
import UserModel, { User } from "../models/User";
import { UserRole } from "../models/UserRole";
import bcrypt from "bcryptjs";
import { WorkingSchedule } from "./../models/WorkingSchedule";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await UserModel.find(); // Example using Mongoose or any ORM to fetch users
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

export const createBarber = async (userData: CreateUserDto): Promise<User> => {
  const { email, password, ...rest } = userData;

  // Check if the barber already exists
  const existingBarber = await UserModel.findOne({ email });
  if (existingBarber) {
    throw new Error("Barber already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create an empty working schedule with all days off
  const emptySchedule = [];
  for (const day of [0, 1, 2, 3, 4, 5, 6]) {
    // Iterate through available days
    emptySchedule.push({
      dayOfWeek: day,
      startTime: "00:00",
      endTime: "00:00",
      isWorking: false, // Set all days to not working by default
    });
  }

  // Create and save the new barber with empty schedule
  const barber = new UserModel({
    ...rest,
    email,
    passwordHash: hashedPassword,
    role: UserRole.BARBER,
    workingSchedule: emptySchedule,
    profilePicture: "",
  });

  await barber.save();

  return barber;
};

export const deleteUser = async (barberId: string) => {
  try {
    const barber = await UserModel.findByIdAndDelete(barberId); // Mongoose method to delete by ID
    return barber; // Will return null if not found, or the deleted barber object
  } catch (error) {
    throw new Error("Error deleting barber");
  }
};

export const updateBarberSchedule = async ({
  barberId,
  newSchedule,
}: UpdateScheduleDTO) => {
  try {
    // Find the barber by ID
    const barber = await UserModel.findById(barberId);

    if (!barber) {
      throw new Error("Barber not found");
    }

    // Update the barber's working schedule
    barber.workingSchedule = newSchedule;

    // Save the updated barber document
    await barber.save();

    return barber; // Return the updated barber object
  } catch (error) {
    console.error("Error updating barber schedule:", error);
    throw new Error("Could not update barber's schedule");
  }
};

export const createService = async (serviceData: {
  name: string;
  price: number;
  duration: number;
}): Promise<Service> => {
  const { name, price, duration } = serviceData;

  // Check if the service already exists
  const existingService = await ServiceModel.findOne({ name });
  if (existingService) {
    throw new Error("Service already exists");
  }

  // Create and save the new service
  const service = new ServiceModel({
    name,
    price,
    duration,
  });

  await service.save();

  return service;
};

export const deleteService = async (serviceId: string): Promise<void> => {
  // Find the service by ID and delete it
  console.log(serviceId);
  const service = await ServiceModel.findByIdAndDelete(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }

  // No return value needed as we're simply deleting the service
};

export const modifyService = async (
  serviceId: string,
  updatedData: { name?: string; price?: number; duration?: number }
): Promise<Service> => {
  // Find and update the service by ID
  const service = await ServiceModel.findByIdAndUpdate(serviceId, updatedData, {
    new: true,
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};
