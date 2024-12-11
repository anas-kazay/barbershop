import UserModel, { User } from "../models/User"; // Assuming you have a User model

// Function to get all barbers
export const getAllBarbers = async (): Promise<User[]> => {
  try {
    return await UserModel.find({ role: "barber" });
  } catch (error) {
    throw new Error("Error fetching barbers");
  }
};
