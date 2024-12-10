import { Request, Response } from "express";
import * as userService from "../services/userService";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateUserDto } from "../dtos/createUserDto";
import jwt from "jsonwebtoken";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your_very_long_and_complex_random_secret_key_here_12345!@#$%";

// Create a new user
export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Convert plain object to DTO and validate
    const userDto = plainToClass(CreateUserDto, req.body);

    // Validate the DTO
    const errors = await validate(userDto);
    if (errors.length > 0) {
      // If validation fails, return detailed error messages
      res.status(400).json({
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
    }

    // Add role to the DTO
    //userDto.role = UserRole.CUSTOMER;

    // Create user using the validated DTO
    const newUser = await userService.createUser(userDto);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// User login
export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid credentials" });
  }
};

// Get user by ID
export const getUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized: Token not provided" });
      return;
    }

    const decoded: { userId: string } = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    const userId = decoded.userId;

    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
