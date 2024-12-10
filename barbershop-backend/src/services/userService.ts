import UserModel, { User } from "../models/User";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRole } from "../models/UserRole";
import { CreateUserDto } from "../dtos/createUserDto";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Generate JWT for authentication
export const generateJWT = (userId: string, role: UserRole): string => {
  try {
    console.log("Generating token with:", { userId, role, secret: JWT_SECRET });
    const token = jwt.sign({ userId, role }, JWT_SECRET, {
      expiresIn: "16h",
      algorithm: "HS256",
    });
    console.log("Generated Token:", token);
    return token;
  } catch (error) {
    console.error("JWT Generation Error:", error);
    throw error;
  }
};

// Create a new user and save to MongoDB
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { email, password, ...rest } = userData;

  // Check if the user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    ...rest,
    email,
    passwordHash: hashedPassword,
    role: UserRole.CUSTOMER,
  });

  await user.save();

  return user;
};

// Authenticate user using email and password, return JWT token
export const loginUser = async (
  email: string,
  password: string
): Promise<{
  token: string;
  user: { id: string; email: string; role: UserRole; name: string };
}> => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.passwordHash) {
    throw new Error("Password not set for user");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateJWT(user.id, user.role);
  const filteredUser = {
    id: user.id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };
  console.log(filteredUser);

  return { token, user: filteredUser };
};

// Get a user by their ID from MongoDB
export const getUserById = async (id: string): Promise<User | null> => {
  const user = await UserModel.findById(id);
  if (!user) return null;
  return user;
};
