import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { VercelRequest, VercelResponse } from "@vercel/node";

import connectDB from "./config/db";
import barberRoutes from "./routes/barberRoutes";
import userRoutes from "./routes/userRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import serviceRoutes from "./routes/serviceRoutes";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);

// Vercel Serverless Function Handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Forward to Express app
  app(req, res);
}
