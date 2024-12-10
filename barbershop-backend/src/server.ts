import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import barberRoutes from "./routes/barberRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();

const app = express();

const port = process.env.PORT;

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

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
